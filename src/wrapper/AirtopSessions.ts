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
   * Use `lookbackSeconds` to control this behavior.
   *
   * @param {string} sessionId - The ID of the session to monitor
   * @param {Object} configuration - The optional configuration parameters for the function
   * @param {number} [configuration.lookbackSeconds=5] - The number of seconds to look back for prior events. Default `5`. 0 means no lookback.
   * @param {Sessions.RequestOptions} [requestOptions] - Optional request configuration including timeout
   * @returns {Promise<{ id: string, downloadUrl: string } | null>} Object containing file's id and downloadUrl, or null if timed out
   */
  async waitForDownload(
    sessionId: string,
    configuration?: { lookbackSeconds?: number },
    requestOptions?: SessionsNamespace.RequestOptions,
  ): Promise<{ id: string; downloadUrl: string } | null> {
    const { lookbackSeconds = 5 } = configuration || {};
    this.log(`waiting for file to be available on session: ${sessionId}`);
    const startTime = new Date();
    const timeoutSeconds = requestOptions?.timeoutInSeconds || 120;

    // Create a promise that resolves to null after the timeout
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => {
        this.log(`waiting for file timed out after ${timeoutSeconds} seconds`);
        resolve(null);
      }, timeoutSeconds * 1000);
    });

    // Create a promise for the event processing
    const processEventsPromise = (async () => {
      const sessionEvents = await this.events(
        sessionId,
        { all: lookbackSeconds >= 0 },
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
   * Waits for a file download to start in a session.
   * Defaults to looking back 5 seconds in the event stream for the file to be available.
   * Use `lookbackSeconds` to control this behavior.
   *
   * @param {string} sessionId - The ID of the session to monitor
   * @param {Object} configuration - The optional configuration parameters for the function
   * @param {number} [configuration.lookbackSeconds=5] - The number of seconds to look back for prior events. Default `5`. 0 means no lookback.
   * @param {Sessions.RequestOptions} [requestOptions] - Optional request configuration including timeout
   * @returns {Promise<{ id: string, downloadUrl: string } | null>} Object containing file's id and downloadUrl, or null if timed out
   */
  async waitForDownloadStart(
    sessionId: string,
    configuration?: { lookbackSeconds?: number },
    requestOptions?: SessionsNamespace.RequestOptions,
  ): Promise<{ id: string; downloadUrl: string } | null> {
    const { lookbackSeconds = 5 } = configuration || {};
    const startTime = new Date();
    const timeoutSeconds = requestOptions?.timeoutInSeconds || 60;

    // Create a promise that resolves to null after the timeout
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), timeoutSeconds * 1000);
    });

    // Create a promise for the event processing
    const processEventsPromise = (async () => {
      const sessionEvents = await this.events(
        sessionId,
        { all: lookbackSeconds >= 0 },
        { timeoutInSeconds: timeoutSeconds, ...(requestOptions || {}) },
      );
      for await (const event of sessionEvents) {
        const e = event as any;
        if (e.event === 'file_status') {
          this.log(`file_status message received:\n${JSON.stringify(event, null, 2)}`);
          if (e.status === 'uploading') {
            const eventTime = Date.parse(e.eventTime);
            const thresholdTime = startTime.getTime() - lookbackSeconds * 1000;
            if (eventTime < thresholdTime) {
              this.log(
                `skipping file uploading event for ${e.fileId} because its timestamp is earlier than lookbackSeconds`,
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
   * Downloads the next file from a session as soon as it starts to become available
   *
   * @param {string} sessionId - The ID of the session to download from
   * @param {string} destinationPath - The local path where the file should be saved
   * @param {Object} configuration - The optional configuration parameters for the function
   * @param {function} [configuration.onProgress] - Optional callback to track download progress
   * @param {number} [configuration.lookbackSeconds=5] - Optional number of seconds to look back for prior events. Default `5`. 0 means no lookback.
   * @param {number} [configuration.timeoutSeconds=120] - Optional timeout in seconds. Default `120`.
   * @param {Sessions.RequestOptions} [requestOptions] - Optional request configuration including timeout
   * @throws Error if no file is available to download within the timeout period
   */
  async downloadNextFile(
    sessionId: string,
    destinationPath: string,
    configuration?: {
      onProgress?: (downloadedBytes: number, totalBytes: number) => void;
      lookbackSeconds?: number;
      timeoutSeconds?: number;
    },
    requestOptions?: SessionsNamespace.RequestOptions,
  ): Promise<void> {
    const { onProgress = undefined, lookbackSeconds = 5, timeoutSeconds = 120 } = configuration || {};
    const nextFile = await this.waitForDownload(
      sessionId,
      { lookbackSeconds },
      { timeoutInSeconds: timeoutSeconds, ...(requestOptions || {}) },
    );
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

  /**
   * Waits for a file upload to become available to a session.
   *
   * @param sessionId - The session id for the file upload.
   * @param fileId - The file id for the file upload.
   * @param timeoutSeconds - The timeout in seconds.
   * @returns The event for the file upload.
   */
  async waitForUploadAvailable(sessionId: string, fileId: string, timeoutSeconds = 300) {
    this.log(`waiting for uploaded file to be available on session: ${sessionId} ${fileId}`);
    // Create a promise that resolves to null after the timeout
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), timeoutSeconds * 1000);
    });

    // Create a promise for the event processing
    const processEventsPromise = (async () => {
      const sessionEvents = await this.events(sessionId, { all: true }, { timeoutInSeconds: timeoutSeconds });
      for await (const event of sessionEvents) {
        const e = event as any;
        if (e.event === 'file_upload_status') {
          if (e.fileId === fileId) {
            if (e.status === 'available') {
              this.log(`uploaded file is now available on session: ${sessionId} ${fileId}`);
              return event;
            }
            if (e.status === 'upload_failed') {
              this.log(`upload failed: ${sessionId} ${fileId}`);
              throw new Error(`upload failed: ${e.eventData.error}`);
            }
          }
        }
      }
      return null;
    })();

    // Race the timeout against the event processing
    return Promise.race([timeoutPromise, processEventsPromise]);
  }

  /**
   * Captcha event listener
   * Defaults to looking back 5 seconds in the event stream for the captcha event to be available.
   * Use `lookbackSeconds` to control this behavior.
   *
   * @param {string} sessionId - The ID of the session to monitor
   * @param {function} callback - The callback function to be called when a captcha event is received
   * @param {Object} configuration - The optional configuration parameters for the function
   * @param {number} [configuration.lookbackSeconds=5] - The number of seconds to look back for prior events. Default `5`. 0 means no lookback.
   * @param {Sessions.RequestOptions} [requestOptions] - Optional request configuration including timeout
   * @returns {function} - A function to stop listening for captcha events
   */
  onCaptchaEvent(
    sessionId: string,
    callback: (data: Airtop.CaptchaEventMessage) => void | Promise<void>,
    configuration?: { lookbackSeconds?: number },
    requestOptions?: SessionsNamespace.RequestOptions,
  ): () => void {
    let lastCallbackPromise = Promise.resolve();
    const abortController = new AbortController();
    const startTime = new Date();
    const { lookbackSeconds = 5 } = configuration || {};
    const timeoutSeconds = requestOptions?.timeoutInSeconds || 60;

    (async () => {
      const sessionEvents = await this.events(
        sessionId,
        { all: lookbackSeconds >= 0 },
        {
          timeoutInSeconds: timeoutSeconds,
          ...requestOptions,
          abortSignal: abortController.signal,
        },
      );

      for await (const event of sessionEvents) {
        const e = event as any;
        if (e.event === 'captcha-event') {
          this.log(`captcha-event message received:\n${JSON.stringify(event, null, 2)}`);
          const msg = e as Airtop.CaptchaEventMessage;
          const eventTime = Date.parse(e.eventTime);
          const thresholdTime = startTime.getTime() - lookbackSeconds * 1000;

          if (eventTime < thresholdTime) {
            this.log('skipping captcha event because its timestamp is earlier than lookbackSeconds');
            continue;
          }

          lastCallbackPromise = lastCallbackPromise
            .then(() => callback(msg))
            .catch((error) => this.log(`Error in captcha callback: ${error}`));
        }
      }
    })().catch((error) => {
      if (error.name !== 'AbortError') {
        this.log(`Error in event processing: ${error}`);
      }
    });

    return () => {
      abortController.abort();
    };
  }
}
