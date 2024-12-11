import type { BatchOperationUrl } from "./types";

export const distributeUrlsToBatches = (
	urls: BatchOperationUrl[],
	maxConcurrentSessions: number,
): BatchOperationUrl[][] => {
	if (urls.length === 0) return [];

	// Calculate optimal number of batches
	const batchCount = Math.min(maxConcurrentSessions, urls.length);
	const batches: BatchOperationUrl[][] = Array.from(
		{ length: batchCount },
		() => [],
	);

	urls.forEach((url, index) => {
		const batchIndex = index % batchCount;
		if (!batches[batchIndex]) {
			batches[batchIndex] = [];
		}
		batches[batchIndex].push(url);
	});

	return batches;
};
