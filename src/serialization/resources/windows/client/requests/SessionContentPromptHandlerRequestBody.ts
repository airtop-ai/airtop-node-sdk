/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../index";
import * as Airtop from "../../../../../api/index";
import * as core from "../../../../../core";

export const SessionContentPromptHandlerRequestBody: core.serialization.Schema<
    serializers.SessionContentPromptHandlerRequestBody.Raw,
    Airtop.SessionContentPromptHandlerRequestBody
> = core.serialization.object({
    clientRequestId: core.serialization.string().optional(),
    costThresholdCredits: core.serialization.number().optional(),
    followPaginationLinks: core.serialization.boolean().optional(),
    prompt: core.serialization.string(),
    timeThresholdSeconds: core.serialization.number().optional(),
});

export declare namespace SessionContentPromptHandlerRequestBody {
    interface Raw {
        clientRequestId?: string | null;
        costThresholdCredits?: number | null;
        followPaginationLinks?: boolean | null;
        prompt: string;
        timeThresholdSeconds?: number | null;
    }
}