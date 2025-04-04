/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Airtop from "../../api/index";
import * as core from "../../core";

export const PaginatedExtractionExperimentalConfig: core.serialization.ObjectSchema<
    serializers.PaginatedExtractionExperimentalConfig.Raw,
    Airtop.PaginatedExtractionExperimentalConfig
> = core.serialization.object({
    scrollWithin: core.serialization.string().optional(),
});

export declare namespace PaginatedExtractionExperimentalConfig {
    export interface Raw {
        scrollWithin?: string | null;
    }
}
