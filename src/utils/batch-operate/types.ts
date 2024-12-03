import type { AirtopSessionConfigV1 } from "wrapper/AirtopSessions";

export type BatchOperateConfig = {
	maxConcurrentSessions?: number;
	maxWindowsPerSession?: number;
	sessionConfig?: AirtopSessionConfigV1;
	onError?: (data: {error: Error | string, urls?: string[]}) => void;
};

export type BatchOperationUrl = {
	url: string;
	context?: Record<string, unknown>;
};

export type BatchOperationInput = {
	windowId: string;
	sessionId: string;
	liveViewUrl: string;
	url: string;
	context?: Record<string, unknown>;
};

export type BatchOperationResponse = {
	shouldHaltBatch?: boolean;
	additionalUrls?: BatchOperationUrl[];
};
