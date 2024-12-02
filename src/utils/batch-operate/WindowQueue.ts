import type { AirtopClient } from "wrapper/AirtopClient";
import type {
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
	) => Promise<BatchOperationResponse>;
	private onError?: (error: Error | string) => void;
	private isHalted = false;

	constructor(
		maxWindowsPerSession: number,
		runEmitter: EventEmitter,
		sessionId: string,
		client: AirtopClient,
		operation: (input: BatchOperationInput) => Promise<BatchOperationResponse>,
		onError?: (error: Error | string) => void,
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
			let windowId: string | undefined;
			const promise = (async () => {
				// Do not process any more urls if the processing has been halted
				if (this.isHalted) {
					this.client.log(
						`Processing halted, skipping window creation for ${urlData.url}`,
					);
					return;
				}

				try {
					// Create a new window pointed to the url
					this.client.log(
						`Creating window for ${urlData.url} in session ${this.sessionId}`,
					);
					const { data } = await this.client.windows.create(this.sessionId, {
						url: urlData.url,
					});
					windowId = data.windowId;

					if (!windowId) {
						throw new Error("WindowId not found");
					}

					const { data: windowInfo } =
						await this.client.windows.getWindowInfo(this.sessionId, windowId);

					// Run the operation on the window
					const result = await this.operation({
						windowId,
						sessionId: this.sessionId,
						liveViewUrl: windowInfo.liveViewUrl,
						url: urlData.url,
						context: urlData.context,
					});

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
				} catch (error) {
					if (this.onError) {
						this.onError(
							error instanceof Error ? error.message : String(error),
						);
					} else {
						// By default, log the error and continue
						this.client.error(
							error instanceof Error ? error.message : String(error),
						);
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
