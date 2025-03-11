import type * as Airtop from '../api';
import { Requests as RequestsClass, type Requests as RequestsNamespace } from '../api/resources/requests/client/Client';

export class AirtopRequests extends RequestsClass {
  constructor(readonly _options: RequestsNamespace.Options) {
    super(_options);
  }

  /**
   * Waits until a request is complete or times out
   *
   * @param requestId - The ID of the request to poll.
   * @param timeoutSeconds - Maximum time to wait in seconds.
   * @param intervalSeconds - Polling interval in seconds.
   * @param requestOptions - Request-specific configuration.
   *
   * @example
   *     const result = await client.requests.pollRequestUntilComplete("123e4567-e89b-12d3-a456-426614174000", 300, 2)
   */
  async waitForRequestCompletion(
    requestId: string,
    timeoutSeconds = 300,
    intervalSeconds = 2,
    requestOptions?: RequestsNamespace.RequestOptions,
  ): Promise<Airtop.RequestStatusResponse> {
    const startTime = Date.now();
    const timeoutMs = timeoutSeconds * 1000;

    while (Date.now() - startTime < timeoutMs) {
      const response = await this.getRequestStatus(requestId, requestOptions);

      if (response.status === 'completed' || response.status === 'failed') {
        return response;
      }

      await new Promise((resolve) => setTimeout(resolve, intervalSeconds * 1000));
    }

    throw new Error(`Request ${requestId} polling timed out after ${timeoutSeconds} seconds`);
  }
}
