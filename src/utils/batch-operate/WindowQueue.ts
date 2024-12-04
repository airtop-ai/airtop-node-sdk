import type { AirtopClient } from "wrapper/AirtopClient";
import type {
	BatchOperationError,
	BatchOperationInput,
	BatchOperationResponse,
	BatchOperationUrl,
} from "./types";
import type { EventEmitter } from "node:events";

export class WindowQueue {
	private activePromises: Promise<void>[] = [];
	private urlQueue: BatchOperationUrl[] = [];
	private maxWindowsPerSession: number;
	private runEmitter: EventEmitter;
	private sessionId: string;
	private client: AirtopClient;
	private operation: (
		input: BatchOperationInput,
	) => Promise<BatchOperationResponse | undefined>;
	private onError?: (error: BatchOperationError) => Promise<void>;
	private isHalted = false;

	constructor(
		maxWindowsPerSession: number,
		runEmitter: EventEmitter,
		sessionId: string,
		client: AirtopClient,
		operation: (input: BatchOperationInput) => Promise<BatchOperationResponse | undefined>,
		onError?: (error: BatchOperationError) => Promise<void>,
	) {
		if (!Number.isInteger(maxWindowsPerSession) || maxWindowsPerSession <= 0) {
			throw new Error("maxWindowsPerSession must be a positive integer");
		}

		this.maxWindowsPerSession = maxWindowsPerSession;
		this.runEmitter = runEmitter;
		this.sessionId = sessionId;
		this.client = client;
		this.operation = operation;
		this.onError = onError;
	}

	public addUrlToQueue(url: BatchOperationUrl): void {
		this.urlQueue.push(url);
	}

	private handleHaltEvent(): void {
		this.client.log("Halt event received");
		this.isHalted = true;
	}

	async processInBatches(urls: BatchOperationUrl[]): Promise<void> {
		this.runEmitter.once("halt", this.handleHaltEvent);

		this.urlQueue = [...urls];
		this.client.log(
			`Processing batch: ${JSON.stringify(urls)} for session ${this.sessionId}`,
		);

		while (this.urlQueue.length > 0) {
			// Wait for any window to complete before starting a new one
			if (this.activePromises.length >= this.maxWindowsPerSession) {
				await Promise.race(this.activePromises);
				continue;
			}

			const urlData = this.urlQueue.shift(); // Take the next url from the queue
			if (!urlData) break; // No more urls to process

			// If we have less than the max concurrent operations, start a new one
			const promise = (async () => {
				// Do not process any more urls if the processing has been halted
				if (this.isHalted) {
					this.client.log(
						`Processing halted, skipping window creation for ${urlData.url}`,
					);
					return;
				}

				let windowId: string | undefined;
				let liveViewUrl: string | undefined;
				try {
					// Create a new window pointed to the url
					this.client.log(
						`Creating window for ${urlData.url} in session ${this.sessionId}`,
					);
					const { data, errors } = await this.client.windows.create(this.sessionId, {
						url: urlData.url,
					});
					windowId = data.windowId;

					if (!windowId) {
						throw new Error(`WindowId not found, errors: ${JSON.stringify(errors)}`);
					}

					const { data: windowInfo } =
						await this.client.windows.getWindowInfo(this.sessionId, windowId);
					liveViewUrl = windowInfo.liveViewUrl;

					// Run the operation on the window
					const result = await this.operation({
						windowId,
						sessionId: this.sessionId,
						liveViewUrl,
						operationUrl: urlData,
					});

					if (result) {
						const { shouldHaltBatch, additionalUrls } = result;

						if (shouldHaltBatch) {
							this.client.log("Emitting halt event");
							this.runEmitter.emit("halt");
						}
	
						if (additionalUrls && additionalUrls.length > 0) {
							this.client.log(
								`Emitting addUrls event with urls: ${JSON.stringify(additionalUrls)}`,
							);
							this.runEmitter.emit("addUrls", additionalUrls);
						}
					}

				} catch (error) {
					if (this.onError) {
						await this.onError({
							error: error instanceof Error || typeof error === 'string' ? error : String(error),
							operationUrls: [urlData],
							sessionId: this.sessionId,
							windowId,
							liveViewUrl,
						});
					} else {
						// By default, log the error and continue
						const message = `Error for URL ${urlData.url}: ${error instanceof Error ? error.message : String(error)}`;
						this.client.error(message);
					}
				} finally {
					if (windowId) {
						await this.client.windows.close(this.sessionId, windowId);
					}
				}
			})();

			this.activePromises.push(promise);

			// Remove the promise from the active list when it resolves
			promise.finally(() => {
				const index = this.activePromises.indexOf(promise);
				if (index > -1) {
					this.activePromises.splice(index, 1);
				}
			});
		}

		// Wait for all processes to complete
		await Promise.allSettled(this.activePromises);

		// Remove the halt listener
		this.runEmitter.removeListener("halt", this.handleHaltEvent);
	}
}
