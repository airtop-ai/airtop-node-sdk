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

export const batchOperate = async (
	urls: BatchOperationUrl[],
	operation: (input: BatchOperationInput) => Promise<BatchOperationResponse>, // operation to invoke on each url
	client: AirtopClient,
	config?: BatchOperateConfig,
): Promise<void> => {
	const runEmitter = new EventEmitter();

	const {
		maxConcurrentSessions = DEFAULT_MAX_CONCURRENT_SESSIONS,
		maxWindowsPerSession = DEFAULT_MAX_WINDOWS_PER_SESSION,
		sessionConfig,
		onError,
	} = config ?? {};

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

	await sessionQueue.waitForProcessingToComplete();
};
