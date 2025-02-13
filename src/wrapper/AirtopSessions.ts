import type * as Airtop from '../api';
import { Sessions as SessionsClass, type Sessions as SessionsNamespace } from '../api/resources/sessions/client/Client';

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

  async waitForSessionReady(
    id: string,
    requestOptions?: SessionsNamespace.RequestOptions,
  ): Promise<Airtop.SessionsEventsResponse | null> {
    const sessionEvents = await this.events(id, {}, { timeoutInSeconds: 60, ...(requestOptions || {}) });
    for await (const event of sessionEvents) {
      this.log(`status message received:\n${JSON.stringify(event, null, 2)}`);
      const e = event as any;
      if (e.event === 'status' && e.status === 'running') {
        return event;
      }
    }
    return null;
  }
}
