/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * @example
 *     {
 *         lastEventId: 0,
 *         all: true
 *     }
 */
export interface SessionsEventsRequest {
    /**
     * last known event id
     */
    lastEventId?: number;
    /**
     * Get all events
     */
    all?: boolean;
}
