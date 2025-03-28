/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../index";
import * as Airtop from "../../../../api/index";
import * as core from "../../../../core";
import { SessionsEventsResponseWindowEvent } from "./SessionsEventsResponseWindowEvent";
import { SessionsEventsResponseSessionEvent } from "./SessionsEventsResponseSessionEvent";
import { SessionsEventsResponseStatus } from "./SessionsEventsResponseStatus";
import { SessionsEventsResponseError } from "./SessionsEventsResponseError";

export const SessionsEventsResponse: core.serialization.Schema<
    serializers.SessionsEventsResponse.Raw,
    Airtop.SessionsEventsResponse
> = core.serialization
    .union("event", {
        windowEvent: SessionsEventsResponseWindowEvent,
        sessionEvent: SessionsEventsResponseSessionEvent,
        status: SessionsEventsResponseStatus,
        error: SessionsEventsResponseError,
    })
    .transform<Airtop.SessionsEventsResponse>({
        transform: (value) => value,
        untransform: (value) => value,
    });

export declare namespace SessionsEventsResponse {
    type Raw =
        | SessionsEventsResponse.WindowEvent
        | SessionsEventsResponse.SessionEvent
        | SessionsEventsResponse.Status
        | SessionsEventsResponse.Error;

    interface WindowEvent extends SessionsEventsResponseWindowEvent.Raw {
        event: "windowEvent";
    }

    interface SessionEvent extends SessionsEventsResponseSessionEvent.Raw {
        event: "sessionEvent";
    }

    interface Status extends SessionsEventsResponseStatus.Raw {
        event: "status";
    }

    interface Error extends SessionsEventsResponseError.Raw {
        event: "error";
    }
}
