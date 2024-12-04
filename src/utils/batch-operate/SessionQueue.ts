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

export class SessionQueue {
	private activePromises: Promise<void>[] = [];
	private maxConcurrentSessions: number;
	private runEmitter: EventEmitter;
	private maxWindowsPerSession: number;
	private sessionConfig?: AirtopSessionConfigV1;
	private initialBatches: BatchOperationUrl[][] = [];
	private operation: (
		input: BatchOperationInput,
	) => Promise<BatchOperationResponse | undefined>;
	private onError?: (error: BatchOperationError) => Promise<void>;

	private batchQueue: BatchOperationUrl[][] = [];
	private latestProcessingPromise: Promise<void> | null = null;
	private processingPromisesCount = 0;

	private client: AirtopClient;
	private sessionPool: string[] = [];

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
		operation: (input: BatchOperationInput) => Promise<BatchOperationResponse | undefined>;
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

	public async waitForProcessingToComplete(): Promise<void> {
		while (this.processingPromisesCount > 0) {
			await this.latestProcessingPromise;
		}

		await this.terminateAllSessions();
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
						const { data: session } = await this.client.sessions.create({
							configuration: this.sessionConfig,
						});
						sessionId = session.id;
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
					await queue.processInBatches(batch);

					// Return the session to the pool
					this.sessionPool.push(sessionId);
				} catch (error) {
					const urls = batch.map((url) => url.url);
					if (this.onError) {
						await this.onError({
							error: error instanceof Error || typeof error === 'string' ? error : String(error),
							operationUrls: batch,
							sessionId,
						});
					} else {
						// By default, log the error and continue
						const message = `Error for URLs ${JSON.stringify(urls)}: ${error instanceof Error ? error.message : String(error)}`;
						this.client.error(message);
					}

					// Clean up the session in case of error
					if (sessionId) {
						await this.client.sessions.terminate(sessionId);
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
}
