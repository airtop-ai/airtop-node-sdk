/**
 * This file was auto-generated by Fern from our API Definition.
 */

export interface BrowserWaitSelectorConfig {
    /** If true, Airtop AI will wait for the element to not be in the DOM or to be hidden. */
    hidden?: boolean;
    /** The maximum time to wait for the selector to be present, in seconds. Defaults to 30 (30 seconds). */
    timeoutSeconds?: number;
    /** If true, Airtop AI will wait for the element to be visible and present in the DOM. */
    visible?: boolean;
}
