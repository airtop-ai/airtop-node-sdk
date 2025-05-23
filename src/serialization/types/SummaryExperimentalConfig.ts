/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Airtop from "../../api/index";
import * as core from "../../core";

export const SummaryExperimentalConfig: core.serialization.ObjectSchema<
    serializers.SummaryExperimentalConfig.Raw,
    Airtop.SummaryExperimentalConfig
> = core.serialization.object({
    includeVisualAnalysis: core.serialization.string().optional(),
});

export declare namespace SummaryExperimentalConfig {
    export interface Raw {
        includeVisualAnalysis?: string | null;
    }
}
