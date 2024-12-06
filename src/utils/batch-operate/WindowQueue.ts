import type { AirtopClient } from "wrapper/AirtopClient";
import type {
	BatchOperationError,
	BatchOperationInput,
	BatchOperationResponse,
	BatchOperationUrl,
} from "./types";
import type { EventEmitter } from "node:events";
import type { Issue } from "api";
import { Mutex } from 'async-mutex';

export class WindowQueue<T> {
	private activePromises: Promise<void>[] = [];
	private urlQueue: BatchOperationUrl[] = [];
	private activePromisesMutex = new Mutex();
	private urlQueueMutex = new Mutex();

	private maxWindowsPerSession: number;
	private runEmitter: EventEmitter;
	private sessionId: string;
	private client: AirtopClient;
	private operation: (
		input: BatchOperationInput,
	) => Promise<BatchOperationResponse<T>>;
	private onError?: (error: BatchOperationError) => Promise<void>;
	private isHalted = false;

	constructor(
		maxWindowsPerSession: number,
		runEmitter: EventEmitter,
		sessionId: string,
		client: AirtopClient,
		operation: (input: BatchOperationInput) => Promise<BatchOperationResponse<T>>,
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

	public async addUrlToQueue(url: BatchOperationUrl): Promise<void> {
		await this.urlQueueMutex.runExclusive(() => {
			this.urlQueue.push(url);
		});
	}

	private handleHaltEvent(): void {
		this.client.log("Halt event received");
		this.isHalted = true;
	}

	async processInBatches(urls: BatchOperationUrl[]): Promise<T[]> {
		const results: T[] = [];
		this.runEmitter.once("halt", this.handleHaltEvent);

		await this.urlQueueMutex.runExclusive(() => {
			this.urlQueue = [...urls];
		});
		this.client.log(
			`Processing batch: ${JSON.stringify(urls)} for session ${this.sessionId}`,
		);

		while (this.urlQueue.length > 0) {
			// Wait for any window to complete before starting a new one
			let shouldContinue = false;
			await this.activePromisesMutex.runExclusive(async () => {
				if (this.activePromises.length >= this.maxWindowsPerSession) {
					await Promise.race(this.activePromises);
					shouldContinue = true;
				}
			});

			if (shouldContinue) continue;

			let urlData: BatchOperationUrl | undefined;
			await this.urlQueueMutex.runExclusive(() => {
				urlData = this.urlQueue.shift(); // Take the next url from the queue
			});
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
					const { data, errors, warnings } = await this.client.windows.create(this.sessionId, {
						url: urlData.url,
					});
					windowId = data.windowId;

					this.handleErrorAndWarningResponses({ warnings, errors, sessionId: this.sessionId, url: urlData, operation: "window creation" });

					if (!windowId) {
						throw new Error(`WindowId not found, errors: ${JSON.stringify(errors)}`);
					}

					const { data: windowInfo, warnings: windowWarnings, errors: windowErrors } =
						await this.client.windows.getWindowInfo(this.sessionId, windowId);
					liveViewUrl = windowInfo.liveViewUrl;
						
					this.handleErrorAndWarningResponses({ warnings: windowWarnings, errors: windowErrors, sessionId: this.sessionId, url: urlData, operation: "window info retrieval" });

					// Run the operation on the window
					const result = await this.operation({
						windowId,
						sessionId: this.sessionId,
						liveViewUrl,
						operationUrl: urlData,
					});

					if (result) {
						const { shouldHaltBatch, additionalUrls, data } = result;

						if (data){
							results.push(data);
						}

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
						await this.handleErrorWithCallback({
							originalError: error,
							url: urlData,
							callback: this.onError,
							windowId,
							liveViewUrl,
						});
					} else {
						// By default, log the error and continue
						const message = `Error for URL ${urlData.url}: ${this.formatError(error)}`;
						this.client.error(message);
					}
				} finally {
					if (windowId) {
						await this.safelyTerminateWindow(windowId);
					}
				}
			})();

			await this.activePromisesMutex.runExclusive(() => {
				this.activePromises.push(promise);
			});

			// Remove the promise from the active list when it resolves
			promise.finally(async () => {
				await this.activePromisesMutex.runExclusive(() => {
					const index = this.activePromises.indexOf(promise);
					if (index > -1) {
						this.activePromises.splice(index, 1);
					}
				});
			});
		}

		// Wait for all processes to complete
		await Promise.allSettled(this.activePromises);

		// Remove the halt listener
		this.runEmitter.removeListener("halt", this.handleHaltEvent);

		return results;
	}

	private async handleErrorWithCallback({
		originalError,
		url,
		windowId,
		liveViewUrl,
		callback,
	}: {
		originalError: unknown;
		url: BatchOperationUrl;
		windowId?: string;
		liveViewUrl?: string;
		callback: (error: BatchOperationError) => Promise<void>;
	}): Promise<void> {
		// Catch any errors in the onError callback to avoid halting the entire process
		try {
			await callback({
			error: this.formatError(originalError),
			operationUrls: [url],
			sessionId: this.sessionId,
			windowId,
			liveViewUrl,
			});
		} catch (newError) {
			this.client.error(`Error in onError callback: ${this.formatError(newError)}. Original error: ${this.formatError(originalError)}`);
		}
	}

	private async safelyTerminateWindow(windowId: string): Promise<void> {
		try {
			await this.client.windows.close(this.sessionId, windowId);
		} catch (error) {
			this.client.error(`Error closing window ${windowId}: ${this.formatError(error)}`);
		}
	}

	private formatError(error: unknown): string {
		return error instanceof Error ? error.message : String(error);
	}

	private handleErrorAndWarningResponses({ warnings, errors, sessionId, url, operation }: { warnings?: Issue[]; errors?: Issue[]; sessionId: string; url: BatchOperationUrl; operation: string }): void {
		if (!warnings && !errors) return;

		const details: { sessionId: string; url: BatchOperationUrl; warnings?: Issue[]; errors?: Issue[] } = {
			sessionId,
			url,
		};

		if (warnings) {
			details.warnings = warnings;
			this.client.warn(`Received warnings for ${operation}: ${JSON.stringify(details)}`);
		}

		if (errors) {
			details.errors = errors;
			this.client.error(`Received errors for ${operation}: ${JSON.stringify(details)}`);
		}
	}
}
