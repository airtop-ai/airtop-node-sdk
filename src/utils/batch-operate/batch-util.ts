import { EventEmitter } from 'eventemitter3';
import type { AirtopClient } from '../../wrapper/AirtopClient';
import { SessionQueue } from './SessionQueue';
import { distributeUrlsToBatches } from './helpers';
import type { BatchOperateConfig, BatchOperationInput, BatchOperationResponse, BatchOperationUrl } from './types';

const DEFAULT_MAX_WINDOWS_PER_SESSION = 1;
const DEFAULT_MAX_CONCURRENT_SESSIONS = 30;

export const batchOperate = async <T>(
  urls: BatchOperationUrl[],
  operation: (input: BatchOperationInput) => Promise<BatchOperationResponse<T>>, // operation to invoke on each url
  client: AirtopClient,
  config?: BatchOperateConfig,
): Promise<T[]> => {
  // Validate the urls before proceeding
  if (!Array.isArray(urls)) {
    throw new Error('Please provide a valid list of urls');
  }

  for (const url of urls) {
    if (!url || typeof url !== 'object' || !('url' in url)) {
      throw new Error('Please provide a valid list of urls');
    }
  }

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

  runEmitter.on('addUrls', (additionalUrls: BatchOperationUrl[]) => {
    sessionQueue.addUrlsToBatchQueue(additionalUrls);
  });

  await sessionQueue.processInitialBatches();

  return await sessionQueue.waitForProcessingToComplete();
};
