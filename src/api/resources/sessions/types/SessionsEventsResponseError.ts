/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Airtop from "../../../index";

export interface SessionsEventsResponseError {
    data: Airtop.ErrorMessage;
    /** The event ID. */
    id?: number;
    /** The retry time in milliseconds. */
    retry?: number;
}
