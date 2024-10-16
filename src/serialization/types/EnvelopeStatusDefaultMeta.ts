/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Airtop from "../../api/index";
import * as core from "../../core";
import { EnvelopeStatusDefaultMetaStatus } from "./EnvelopeStatusDefaultMetaStatus";

export const EnvelopeStatusDefaultMeta: core.serialization.ObjectSchema<
    serializers.EnvelopeStatusDefaultMeta.Raw,
    Airtop.EnvelopeStatusDefaultMeta
> = core.serialization.object({
    requestId: core.serialization.string().optional(),
    status: EnvelopeStatusDefaultMetaStatus.optional(),
});

export declare namespace EnvelopeStatusDefaultMeta {
    interface Raw {
        requestId?: string | null;
        status?: EnvelopeStatusDefaultMetaStatus.Raw | null;
    }
}
