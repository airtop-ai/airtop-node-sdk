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

export class SessionQueue<T> {
	private activePromises: Promise<void>[] = [];
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
	private latestProcessingPromise: Promise<void> | null = null;
	private processingPromisesCount = 0;

	private client: AirtopClient;
	private sessionPool: string[] = [];

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
		this.batchQueue.push(...newBatches);

		// Update existing processing promise
		this.processingPromisesCount++;
		this.latestProcessingPromise = this.processPendingBatches();
	}

	public async processInitialBatches(): Promise<void> {
		this.batchQueue = [...this.initialBatches];
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
			await this.client.sessions.terminate(sessionId);
		}
	}

	private async processPendingBatches(): Promise<void> {
		while (this.batchQueue.length > 0) {
			// Wait for any session to complete before starting a new one
			if (this.activePromises.length >= this.maxConcurrentSessions) {
				await Promise.race(this.activePromises);
				continue;
			}

			const batch = this.batchQueue.shift();
			if (!batch || batch.length === 0) break;

			const promise = (async () => {
				let sessionId: string | undefined;
				try {
					// Check if there's an available session in the pool
					if (this.sessionPool.length > 0) {
						sessionId = this.sessionPool.pop();
					} else {
						const { data: session, warnings, errors } = await this.client.sessions.create({
							configuration: this.sessionConfig,
						});
						sessionId = session.id;

						if (warnings) {
							this.client.warn(`Warnings received creating session ${sessionId}: ${JSON.stringify(warnings)}`);
						}

						if (errors) {
							this.client.error(`Errors received creating session ${sessionId}: ${JSON.stringify(errors)}`);
						}
					}

					if (!sessionId) {
						throw new Error("No session available for batch");
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
					this.sessionPool.push(sessionId);
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
						await this.safelyTerminateSession(sessionId);
					}
				}
			})();

			this.activePromises.push(promise);

			// Remove the promise when it completes
			promise.finally(() => {
				const index = this.activePromises.indexOf(promise);
				if (index > -1) {
					this.activePromises.splice(index, 1);
				}
			});
		}

		// Wait for all remaining sessions to complete
		await Promise.allSettled(this.activePromises);
		this.processingPromisesCount--;
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

	private async safelyTerminateSession(sessionId: string): Promise<void> {
		try {
			await this.client.sessions.terminate(sessionId);
		} catch (error) {
			this.client.error(`Error terminating session ${sessionId}: ${this.formatError(error)}`);
		}
	}

	private formatError(error: unknown): string {
		return error instanceof Error ? error.message : String(error);
	}
}
