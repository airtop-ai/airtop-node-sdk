import { Transform } from 'readable-stream';
import * as fs from 'fs';
import * as path from 'path';
import type * as Airtop from '../api';
import { Sessions as SessionsClass, type Sessions as SessionsNamespace } from '../api/resources/sessions/client/Client';
import fetch from 'node-fetch';

export interface AirtopSessionConfigV1 extends Airtop.SessionConfigV1 {
  skipWaitSessionReady?: boolean;
}

export interface AirtopSessionRestInputV1 {
  /** Session configuration */
  configuration?: AirtopSessionConfigV1;
}

export class AirtopSessions extends SessionsClass {
  constructor(
    readonly _options: SessionsNamespace.Options,
    private debug = false,
  ) {
    super(_options);
  }

  log(message: any) {
    if (this.debug) {
      console.log(message);
    }
  }

  /**
   * @param {Airtop.SessionRestInputV1} request
   * @param {Sessions.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @example
   *     await client.sessions.create()
   */
  async create(request?: AirtopSessionRestInputV1, requestOptions?: SessionsNamespace.RequestOptions) {
    const createSessionResponse = await super.create(request, requestOptions);

    if (!createSessionResponse.data) {
      throw new Error('Error creating browser session');
    }

    if (request?.configuration?.skipWaitSessionReady) {
      return createSessionResponse;
    }
    this.log(`session created:\n${JSON.stringify(createSessionResponse, null, 2)}`);

    try {
      const event = await this.waitForSessionReady(createSessionResponse.data.id, requestOptions);
      if (!event) {
        this.log('No browser created, timed out?');
        throw new Error('Waiting for session ready timed out');
      }
      const getInfoResponse = await this.getInfo(createSessionResponse.data.id, requestOptions);

      // Merge the createSessionResponse with any new data from getInfoResponse
      return {
        ...createSessionResponse,
        data: {
          ...createSessionResponse.data,
          ...getInfoResponse.data,
        },
      };
    } catch (e) {
      this.log(e);
      throw new Error(`Error creating a new browser ${e}`);
    }
  }

  /**
   * Waits for a session to enter the 'running' status
   *
   * @param id - The ID of the session to wait for
   * @param requestOptions - Optional request configuration including timeout
   * @returns The session event indicating the session is ready, or null if timed out
   */
  async waitForSessionReady(
    id: string,
    requestOptions?: SessionsNamespace.RequestOptions,
  ): Promise<Airtop.SessionsEventsResponse | null> {
    const timeoutSeconds = requestOptions?.timeoutInSeconds || 300;

    // Create a promise that resolves to null after the timeout
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), timeoutSeconds * 1000);
    });

    // Create a promise for the event processing
    const processEventsPromise = (async () => {
      const sessionEvents = await this.events(id, {}, { timeoutInSeconds: timeoutSeconds, ...(requestOptions || {}) });
      for await (const event of sessionEvents) {
        const e = event as any;
        if (e.event === 'status') {
          this.log(`status message received:\n${JSON.stringify(event, null, 2)}`);
          if (e.status === 'running') {
            return event;
          }
        }
      }
      return null;
    })();

    // Race the timeout against the event processing
    return Promise.race([timeoutPromise, processEventsPromise]);
  }

  /**
   * Waits for a file to be downloaded in a session and reach 'available' status.
   * Defaults to looking back 5 seconds in the event stream for the file to be available.
   * Use `includePriorEvents` and `lookbackSeconds` to control this behavior.
   *
   * @param {Object} params - The parameters for the function
   * @param {string} params.sessionId - The ID of the session to monitor
   * @param {boolean} [params.includePriorEvents=true] - Whether to include prior events in the wait. Default `true`.
   * @param {number} [params.lookbackSeconds=5] - The number of seconds to look back for prior events. Default `5`.
   * @param {Sessions.RequestOptions} [requestOptions] - Optional request configuration including timeout
   * @returns {Promise<{ id: string, downloadUrl: string } | null>} Object containing file's id and downloadUrl, or null if timed out
   */
  async waitForDownload(
    sessionId: string,
    configuration?: { includePriorEvents?: boolean; lookbackSeconds?: number },
    requestOptions?: SessionsNamespace.RequestOptions,
  ): Promise<{ id: string; downloadUrl: string } | null> {
    const { includePriorEvents = true, lookbackSeconds = 5 } = configuration || {};
    const startTime = new Date();
    const timeoutSeconds = requestOptions?.timeoutInSeconds || 120;

    // Create a promise that resolves to null after the timeout
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), timeoutSeconds * 1000);
    });

    // Create a promise for the event processing
    const processEventsPromise = (async () => {
      const sessionEvents = await this.events(
        sessionId,
        { all: includePriorEvents },
        { timeoutInSeconds: timeoutSeconds, ...(requestOptions || {}) },
      );
      for await (const event of sessionEvents) {
        const e = event as any;
        if (e.event === 'file_status') {
          if (e.status === 'available') {
            const eventTime = Date.parse(e.eventTime);
            this.log(`file_status message received:\n${JSON.stringify(event, null, 2)}`);
            const thresholdTime = startTime.getTime() - lookbackSeconds * 1000;
            if (eventTime < thresholdTime) {
              this.log(
                `skipping file available event for ${e.fileId} because its timestamp is earlier than lookbackSeconds`,
              );
              continue;
            }

            return {
              id: e.fileId,
              downloadUrl: e.downloadUrl,
            };
          }
        }
      }
      return null;
    })();

    // Race the timeout against the event processing
    return Promise.race([timeoutPromise, processEventsPromise]);
  }

  /**
   * Waits for a file download to start in a session
   *
   * @param {Object} params - The parameters for the function
   * @param {string} params.sessionId - The ID of the session to monitor
   * @param {boolean} [params.includePriorEvents=false] - Whether to include prior events in the wait
   * @param {Sessions.RequestOptions} [requestOptions] - Optional request configuration including timeout
   * @returns {Promise<{ id: string, downloadUrl: string } | null>} Object containing file's id and downloadUrl, or null if timed out
   */
  async waitForDownloadStart(
    { sessionId, includePriorEvents = false }: { sessionId: string; includePriorEvents?: boolean },
    requestOptions?: SessionsNamespace.RequestOptions,
  ): Promise<{ id: string; downloadUrl: string } | null> {
    const timeoutSeconds = requestOptions?.timeoutInSeconds || 60;

    // Create a promise that resolves to null after the timeout
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), timeoutSeconds * 1000);
    });

    // Create a promise for the event processing
    const processEventsPromise = (async () => {
      const sessionEvents = await this.events(
        sessionId,
        { all: includePriorEvents },
        { timeoutInSeconds: timeoutSeconds, ...(requestOptions || {}) },
      );
      for await (const event of sessionEvents) {
        const e = event as any;
        if (e.event === 'file_status') {
          this.log(`file_status message received:\n${JSON.stringify(event, null, 2)}`);
          if (e.status === 'uploading') {
            return {
              id: e.fileId,
              downloadUrl: e.downloadUrl,
            };
          }
        }
      }
      return null;
    })();

    // Race the timeout against the event processing
    return Promise.race([timeoutPromise, processEventsPromise]);
  }

  /**
   * Downloads the next file from a session as soon as it starts to become available
   *
   * @param {Object} params - The parameters for the function
   * @param {string} params.sessionId - The ID of the session to download from
   * @param {string} params.destinationPath - The local path where the file should be saved
   * @param {function} [params.onProgress] - Optional callback to track download progress
   * @param {boolean} [params.includePriorEvents=false] - Whether to include prior events in the wait
   * @param {Sessions.RequestOptions} [requestOptions] - Optional request configuration including timeout
   * @throws Error if no file is available to download within the timeout period
   */
  async downloadNextFile(
    {
      sessionId,
      destinationPath,
      onProgress,
      includePriorEvents = false,
    }: {
      sessionId: string;
      destinationPath: string;
      onProgress?: (downloadedBytes: number, totalBytes: number) => void;
      includePriorEvents?: boolean;
    },
    requestOptions?: SessionsNamespace.RequestOptions,
  ): Promise<void> {
    const nextFile = await this.waitForDownload(sessionId, { includePriorEvents }, requestOptions);
    if (!nextFile) {
      throw new Error('No file to download within timeout');
    }

    const downloadResponse = await fetch(nextFile.downloadUrl);

    if (!downloadResponse.ok) {
      throw new Error(`Failed to download file: ${downloadResponse.statusText}`);
    }

    const totalBytes = Number.parseInt(downloadResponse.headers.get('content-length') ?? '0', 10);
    let downloadedBytes = 0;

    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });

    const fileStream = fs.createWriteStream(destinationPath);

    await new Promise((resolve, reject) => {
      if (onProgress && downloadResponse.body) {
        // Create a transform stream to track progress
        const progressStream = new Transform({
          transform(chunk: Buffer, encoding: string, callback: (error: Error | null, data?: any) => void) {
            downloadedBytes += chunk.length;
            onProgress(downloadedBytes, totalBytes);
            callback(null, chunk);
          },
        });

        downloadResponse.body.pipe(progressStream).pipe(fileStream);

        progressStream.on('error', reject);
      } else {
        // If no progress callback, pipe directly
        downloadResponse.body?.pipe(fileStream);
      }

      downloadResponse.body?.on('error', reject);
      fileStream.on('finish', resolve);
    });
  }
}
