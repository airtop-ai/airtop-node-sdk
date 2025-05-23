/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Airtop from "../../api/index";
import * as core from "../../core";
import { OperationOutcome } from "./OperationOutcome";
import { Issue } from "./Issue";
import { EnvelopeDefaultMeta } from "./EnvelopeDefaultMeta";

export const OperationOutcomeResponse: core.serialization.ObjectSchema<
    serializers.OperationOutcomeResponse.Raw,
    Airtop.OperationOutcomeResponse
> = core.serialization.object({
    data: OperationOutcome,
    errors: core.serialization.list(Issue).optional(),
    meta: EnvelopeDefaultMeta,
    warnings: core.serialization.list(Issue).optional(),
});

export declare namespace OperationOutcomeResponse {
    export interface Raw {
        data: OperationOutcome.Raw;
        errors?: Issue.Raw[] | null;
        meta: EnvelopeDefaultMeta.Raw;
        warnings?: Issue.Raw[] | null;
    }
}
