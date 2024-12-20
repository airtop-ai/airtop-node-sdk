/**
 * This file was auto-generated by Fern from our API Definition.
 */

export interface ErrorDetail {
    /** Where the error occurred, e.g. 'body.items[3].tags' or 'path.thing-id' */
    location?: string;
    /** Error message text */
    message?: string;
    value?: unknown;
}
