/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Airtop from "../../api/index";
import * as core from "../../core";
import { CreateFileV1 } from "./CreateFileV1";
import { Issue } from "./Issue";
import { EnvelopeDefaultMeta } from "./EnvelopeDefaultMeta";

export const EnvelopeCreateFileV1EnvelopeDefaultMeta: core.serialization.ObjectSchema<
    serializers.EnvelopeCreateFileV1EnvelopeDefaultMeta.Raw,
    Airtop.EnvelopeCreateFileV1EnvelopeDefaultMeta
> = core.serialization.object({
    data: CreateFileV1,
    errors: core.serialization.list(Issue).optional(),
    meta: EnvelopeDefaultMeta,
    warnings: core.serialization.list(Issue).optional(),
});

export declare namespace EnvelopeCreateFileV1EnvelopeDefaultMeta {
    export interface Raw {
        data: CreateFileV1.Raw;
        errors?: Issue.Raw[] | null;
        meta: EnvelopeDefaultMeta.Raw;
        warnings?: Issue.Raw[] | null;
    }
}
