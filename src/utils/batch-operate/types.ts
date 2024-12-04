import type { AirtopSessionConfigV1 } from "wrapper/AirtopSessions";

export type BatchOperateConfig = {
	maxConcurrentSessions?: number;
	maxWindowsPerSession?: number;
	sessionConfig?: AirtopSessionConfigV1;
	onError?: (error: BatchOperationError) => Promise<void>;
};

export type BatchOperationUrl = {
	url: string;
	context?: Record<string, unknown>;
};

export type BatchOperationInput = {
	windowId: string;
	sessionId: string;
	liveViewUrl: string;
	operationUrl: BatchOperationUrl;
};

export type BatchOperationResponse = {
	shouldHaltBatch?: boolean;
	additionalUrls?: BatchOperationUrl[];
};

export type BatchOperationError = {
	error: Error | string;
	operationUrls: BatchOperationUrl[];
	sessionId?: string; // Optional in case of error before session was created
	windowId?: string; // Optional in case of error before window was opened
	liveViewUrl?: string; // Optional in case of error before window was opened
};
