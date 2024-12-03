import type { AirtopClient } from "wrapper/AirtopClient";
import type {
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
	private onError?: (error: Error | string) => void;

	private batchQueue: BatchOperationUrl[][] = [];
	private processingPromise: Promise<void> | null = null;

	private client: AirtopClient;

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
		onError?: (error: Error | string) => void;
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
		this.processingPromise = null;

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
		this.processingPromise = this.processPendingBatches();
	}

	public async processInitialBatches(): Promise<void> {
		this.batchQueue = [...this.initialBatches];
		this.processingPromise = this.processPendingBatches();
		await this.processingPromise;
	}

	public async waitForProcessingToComplete(): Promise<void> {
		await this.processingPromise;
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
					const { data: session } = await this.client.sessions.create({
						configuration: this.sessionConfig,
					});
					sessionId = session.id;

					const queue = new WindowQueue(
						this.maxWindowsPerSession,
						this.runEmitter,
						sessionId,
						this.client,
						this.operation,
						this.onError,
					);
					await queue.processInBatches(batch);
				} catch (error) {
					if (this.onError) {
						this.onError(
							error instanceof Error ? error.message : String(error),
						);
					} else {
						this.client.error(
							error instanceof Error ? error.message : String(error),
						);
					}
				} finally {
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
	}
}
