/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Airtop from "../../../../index";

/**
 * @example
 *     {
 *         condition: "Determine if the user appears to be signed in to the website"
 *     }
 */
export interface SessionMonitorHandlerRequestBody {
    clientRequestId?: string;
    /** A natural language description of the condition to monitor for in the browser window. */
    condition: string;
    /** Monitor configuration. If not specified, defaults to an interval monitor with a 5 second interval. */
    configuration?: Airtop.MonitorConfig;
    /** A credit threshold that, once exceeded, will cause the operation to be cancelled. Note that this is *not* a hard limit, but a threshold that is checked periodically during the course of fulfilling the request. A default threshold is used if not specified, but you can use this option to increase or decrease as needed. Set to 0 to disable this feature entirely (not recommended). */
    costThresholdCredits?: number;
    /**
     * A time threshold in seconds that, once exceeded, will cause the operation to be cancelled. Note that this is *not* a hard limit, but a threshold that is checked periodically during the course of fulfilling the request. A default threshold is used if not specified, but you can use this option to increase or decrease as needed. Set to 0 to disable this feature entirely (not recommended).
     *
     * This setting does not extend the maximum session duration provided at the time of session creation.
     */
    timeThresholdSeconds?: number;
}
