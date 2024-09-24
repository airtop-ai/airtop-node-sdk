/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Airtop from "../../api/index";
import * as core from "../../core";
import { ModelResponse } from "./ModelResponse";
import { Issue } from "./Issue";
import { ExternalSessionAiResponseMetadata } from "./ExternalSessionAiResponseMetadata";

export const ModelResponseExternalSessionAiResponseMetadataWrapper: core.serialization.ObjectSchema<
    serializers.ModelResponseExternalSessionAiResponseMetadataWrapper.Raw,
    Airtop.ModelResponseExternalSessionAiResponseMetadataWrapper
> = core.serialization.object({
    data: ModelResponse,
    errors: core.serialization.list(Issue).optional(),
    meta: ExternalSessionAiResponseMetadata,
    warnings: core.serialization.list(Issue).optional(),
});

export declare namespace ModelResponseExternalSessionAiResponseMetadataWrapper {
    interface Raw {
        data: ModelResponse.Raw;
        errors?: Issue.Raw[] | null;
        meta: ExternalSessionAiResponseMetadata.Raw;
        warnings?: Issue.Raw[] | null;
    }
}