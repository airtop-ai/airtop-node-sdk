import type { AirtopClient } from "wrapper/AirtopClient";
import type {
	BatchOperateConfig,
	BatchOperationInput,
	BatchOperationResponse,
	BatchOperationUrl,
} from "./types";
import { EventEmitter } from "node:events";
import { distributeUrlsToBatches } from "./helpers";
import { SessionQueue } from "./SessionQueue";

const DEFAULT_MAX_WINDOWS_PER_SESSION = 1;
const DEFAULT_MAX_CONCURRENT_SESSIONS = 30;

export const batchOperate = async<T> (
	urls: BatchOperationUrl[],
	operation: (input: BatchOperationInput) => Promise<BatchOperationResponse<T>>, // operation to invoke on each url
	client: AirtopClient,
	config?: BatchOperateConfig,
): Promise<T[]> => {
	const runEmitter = new EventEmitter();

	const {
		maxConcurrentSessions = DEFAULT_MAX_CONCURRENT_SESSIONS,
		maxWindowsPerSession = DEFAULT_MAX_WINDOWS_PER_SESSION,
		sessionConfig,
		onError,
	} = config ?? {};

	// Set the maximum number of listeners to accommodate all concurrent sessions and windows
	runEmitter.setMaxListeners(maxConcurrentSessions + (maxConcurrentSessions * maxWindowsPerSession) + 1);

	// Split the urls into batches
	const initialBatches = distributeUrlsToBatches(urls, maxConcurrentSessions);
	const sessionQueue = new SessionQueue({
		maxConcurrentSessions,
		runEmitter,
		maxWindowsPerSession,
		initialBatches,
		operation,
		client,
		sessionConfig,
		onError,
	});

	runEmitter.on("addUrls", (additionalUrls: BatchOperationUrl[]) => {
		sessionQueue.addUrlsToBatchQueue(additionalUrls);
	});

	await sessionQueue.processInitialBatches();

	return await sessionQueue.waitForProcessingToComplete();
};
