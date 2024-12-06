import type { AirtopClient } from "wrapper/AirtopClient";
import type {
	BatchOperationError,
	BatchOperationInput,
	BatchOperationResponse,
	BatchOperationUrl,
} from "./types";
import type { EventEmitter } from "node:events";
import type { AirtopSessionConfigV1 } from "wrapper/AirtopSessions";
import { distributeUrlsToBatches } from "./helpers";
import { WindowQueue } from "./WindowQueue";
import type { Issue } from "api";
import { Mutex } from 'async-mutex';

export class SessionQueue<T> {
	private activePromises: Promise<void>[] = [];
	private activePromisesMutex = new Mutex();

	private maxConcurrentSessions: number;
	private runEmitter: EventEmitter;
	private maxWindowsPerSession: number;
	private sessionConfig?: AirtopSessionConfigV1;
	private initialBatches: BatchOperationUrl[][] = [];
	private operation: (
		input: BatchOperationInput,
	) => Promise<BatchOperationResponse<T>>;
	private onError?: (error: BatchOperationError) => Promise<void>;

	private batchQueue: BatchOperationUrl[][] = [];
	private batchQueueMutex = new Mutex();
	private latestProcessingPromise: Promise<void> | null = null;
	private processingPromisesCount = 0;

	private client: AirtopClient;
	private sessionPool: string[] = [];
	private sessionPoolMutex = new Mutex();

	private results: T[];

	constructor({
		maxConcurrentSessions,
		runEmitter,
		maxWindowsPerSession,
		initialBatches,
		operation,
		client,
		sessionConfig,
		onError,
	}: {
		maxConcurrentSessions: number;
		runEmitter: EventEmitter;
		maxWindowsPerSession: number;
		initialBatches: BatchOperationUrl[][];
		operation: (input: BatchOperationInput) => Promise<BatchOperationResponse<T>>;
		client: AirtopClient;
		sessionConfig?: AirtopSessionConfigV1;
		onError?: (error: BatchOperationError) => Promise<void>;
	}) {
		if (
			!Number.isInteger(maxConcurrentSessions) ||
			maxConcurrentSessions <= 0
		) {
			throw new Error("maxConcurrentSessions must be a positive integer");
		}

		this.maxConcurrentSessions = maxConcurrentSessions;
		this.runEmitter = runEmitter;
		this.maxWindowsPerSession = maxWindowsPerSession;
		this.sessionConfig = sessionConfig;
		this.initialBatches = initialBatches;
		this.operation = operation;
		this.onError = onError;
		this.latestProcessingPromise = null;
		this.results = [];
		this.client = client;
	}

	public async addUrlsToBatchQueue(
		newBatch: BatchOperationUrl[],
	): Promise<void> {
		// Distribute new URLs across batches
		const newBatches = distributeUrlsToBatches(
			newBatch,
			this.maxConcurrentSessions,
		);

		this.client.log(
			`Adding new batches to queue: ${JSON.stringify(newBatches)}`,
		);

		// Add new batches to the queue
		await this.batchQueueMutex.runExclusive(() => {
			this.batchQueue.push(...newBatches);
		});

		// Update existing processing promise
		this.processingPromisesCount++;
		this.latestProcessingPromise = this.processPendingBatches();
	}

	public async processInitialBatches(): Promise<void> {
		await this.batchQueueMutex.runExclusive(() => {
			this.batchQueue = [...this.initialBatches];
		});
		this.processingPromisesCount++;
		this.latestProcessingPromise = this.processPendingBatches();
		await this.latestProcessingPromise;
	}

	public async waitForProcessingToComplete(): Promise<T[]> {
		while (this.processingPromisesCount > 0) {
			await this.latestProcessingPromise;
		}

		await this.terminateAllSessions();

		return this.results;
	}

	private async terminateAllSessions(): Promise<void> {
		for (const sessionId of this.sessionPool) {
			this.safelyTerminateSession(sessionId);
		}
	}

	private async processPendingBatches(): Promise<void> {
		try {
			while (this.batchQueue.length > 0) {
				// Wait for any session to complete before starting a new one
				let shouldContinue = false;
				await this.activePromisesMutex.runExclusive(async () => {
					if (this.activePromises.length >= this.maxConcurrentSessions) {
						await Promise.race(this.activePromises);
						shouldContinue = true;
					}
				});

				if (shouldContinue) continue;

				let batch: BatchOperationUrl[] | undefined;
				await this.batchQueueMutex.runExclusive(() => {
					batch = this.batchQueue.shift();
				});

				if (!batch || batch.length === 0) break;

				const promise = (async () => {
					let sessionId: string | undefined;
					try {
						// Check if there's an available session in the pool
						await this.sessionPoolMutex.runExclusive(() => {
							if (this.sessionPool.length > 0) {
								sessionId = this.sessionPool.pop();
							}
						});

						// Otherwise, create a new session
						if (!sessionId) {
							const { data: session, warnings, errors } = await this.client.sessions.create({
								configuration: this.sessionConfig,
							});
							sessionId = session.id;

							this.handleErrorAndWarningResponses({ warnings, errors, sessionId, batch });
						}

						const queue = new WindowQueue(
							this.maxWindowsPerSession,
							this.runEmitter,
							sessionId,
							this.client,
							this.operation,
							this.onError,
						);
						const windowResults = await queue.processInBatches(batch);
						this.results.push(...windowResults);

						// Return the session to the pool
						await this.sessionPoolMutex.runExclusive(() => {
							if (!sessionId) {
								throw new Error("Missing sessionId, cannot return to pool");
							}

							this.sessionPool.push(sessionId);
						});
					} catch (error) {
						if (this.onError) {
							await this.handleErrorWithCallback({ originalError: error, batch, sessionId, callback: this.onError });
						} else {
							// By default, log the error and continue
							const urls = batch.map((url) => url.url);
							this.logErrorForUrls(urls, error);
						}

						// Clean up the session in case of error
						if (sessionId) {
							this.safelyTerminateSession(sessionId);
						}
					}
				})();

				await this.activePromisesMutex.runExclusive(() => {
					this.activePromises.push(promise);
				});

				// Remove the promise when it completes
				promise.finally(async () => {
					await this.activePromisesMutex.runExclusive(() => {
						const index = this.activePromises.indexOf(promise);
						if (index > -1) {
							this.activePromises.splice(index, 1);
						}
					});
				});
			}

			// Wait for all remaining sessions to complete
			await Promise.allSettled(this.activePromises);
		} finally {
			this.processingPromisesCount--;
		}
	}

	private async handleErrorWithCallback({
		originalError,
		batch,
		sessionId,
		callback,
	}: {
		originalError: unknown;
		batch: BatchOperationUrl[];
		sessionId?: string;
		callback: (error: BatchOperationError) => Promise<void>;
	}): Promise<void> {
		// Catch any errors in the onError callback to avoid halting the entire process
		try {
			await callback({
				error: this.formatError(originalError),
				operationUrls: batch,
				sessionId,
			});
		} catch (newError) {
			this.client.error(`Error in onError callback: ${this.formatError(newError)}. Original error: ${this.formatError(originalError)}`);
		}
	}

	private logErrorForUrls(urls: string[], error: unknown): void {
		const message = `Error for URLs ${JSON.stringify(urls)}: ${this.formatError(error)}`;
		this.client.error(message);
	}

	private safelyTerminateSession(sessionId: string): void {
		// Do not await since we don't want to block the main thread
		this.client.sessions.terminate(sessionId).catch((error) => {
			this.client.error(`Error terminating session ${sessionId}: ${this.formatError(error)}`);
		});
	}

	private formatError(error: unknown): string {
		return error instanceof Error ? error.message : String(error);
	}

	private handleErrorAndWarningResponses({ warnings, errors, sessionId, batch }: { warnings?: Issue[]; errors?: Issue[]; sessionId: string; batch: BatchOperationUrl[] }): void {
		if (!warnings && !errors) return;

		const details: { sessionId: string; urls: BatchOperationUrl[]; warnings?: Issue[]; errors?: Issue[] } = {
			sessionId,
			urls: batch,
		};
		
		if (warnings) {
			details.warnings = warnings;
			this.client.warn(`Received warnings creating session: ${JSON.stringify(details)}`);
		}

		// Log an object with the errors and the URL
		if (errors) {
			details.errors = errors;
			this.client.error(`Received errors creating session: ${JSON.stringify(details)}`);
		}
	}
}
