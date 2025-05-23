/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Airtop from "../../api/index";
import * as core from "../../core";
import { Issue } from "./Issue";

export const AsyncSessionAiResponseEnvelope: core.serialization.ObjectSchema<
    serializers.AsyncSessionAiResponseEnvelope.Raw,
    Airtop.AsyncSessionAiResponseEnvelope
> = core.serialization.object({
    errors: core.serialization.list(Issue).optional(),
    requestId: core.serialization.string(),
    warnings: core.serialization.list(Issue).optional(),
});

export declare namespace AsyncSessionAiResponseEnvelope {
    export interface Raw {
        errors?: Issue.Raw[] | null;
        requestId: string;
        warnings?: Issue.Raw[] | null;
    }
}
