/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Airtop from "../../api/index";
import * as core from "../../core";

export const PageQueryExperimentalConfig: core.serialization.ObjectSchema<
    serializers.PageQueryExperimentalConfig.Raw,
    Airtop.PageQueryExperimentalConfig
> = core.serialization.object({
    includeVisualAnalysis: core.serialization.string().optional(),
});

export declare namespace PageQueryExperimentalConfig {
    interface Raw {
        includeVisualAnalysis?: string | null;
    }
}