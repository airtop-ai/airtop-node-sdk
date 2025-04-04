/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Airtop from "../../../index";

/**
 * Each oneOf object in the array represents one possible Server Sent Events (SSE) message, serialized as UTF-8 text according to the SSE specification.
 */
export type SessionsEventsResponse =
    | Airtop.SessionsEventsResponse.Status
    | Airtop.SessionsEventsResponse.Error_
    | Airtop.SessionsEventsResponse.WindowEvent
    | Airtop.SessionsEventsResponse.SessionEvent;

export namespace SessionsEventsResponse {
    export interface Status extends Airtop.SessionsEventsResponseStatus {
        event: "status";
    }

    export interface Error_ extends Airtop.SessionsEventsResponseError {
        event: "error";
    }

    export interface WindowEvent extends Airtop.SessionsEventsResponseWindowEvent {
        event: "windowEvent";
    }

    export interface SessionEvent extends Airtop.SessionsEventsResponseSessionEvent {
        event: "sessionEvent";
    }
}
