/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Airtop from "../../../../index";

/**
 * @example
 *     {
 *         text: "Example text"
 *     }
 */
export interface SessionTypeHandlerRequestBody {
    /** If true, and an HTML input field is active, clears the input field before typing the text. */
    clearInputField?: boolean;
    clientRequestId?: string;
    /** Request configuration */
    configuration?: Airtop.MicroInteractionConfigWithExperimental;
    /** A credit threshold that, once exceeded, will cause the operation to be cancelled. Note that this is *not* a hard limit, but a threshold that is checked periodically during the course of fulfilling the request. A default threshold is used if not specified, but you can use this option to increase or decrease as needed. Set to 0 to disable this feature entirely (not recommended). */
    costThresholdCredits?: number;
    /** A natural language description of where to type (e.g. 'the search box', 'username field'). The interaction will be aborted if the target element cannot be found. */
    elementDescription?: string;
    /** If true, simulates pressing the Enter key after typing the text. */
    pressEnterKey?: boolean;
    /** If true, simulates pressing the Tab key after typing the text. Note that the tab key will be pressed after the Enter key if both options are configured. */
    pressTabKey?: boolean;
    /** The text to type into the browser window. */
    text: string;
    /**
     * A time threshold in seconds that, once exceeded, will cause the operation to be cancelled. Note that this is *not* a hard limit, but a threshold that is checked periodically during the course of fulfilling the request. A default threshold is used if not specified, but you can use this option to increase or decrease as needed. Set to 0 to disable this feature entirely (not recommended).
     *
     * This setting does not extend the maximum session duration provided at the time of session creation.
     */
    timeThresholdSeconds?: number;
    /** If true, Airtop AI will wait for the navigation to complete after clicking the element. */
    waitForNavigation?: boolean;
}
