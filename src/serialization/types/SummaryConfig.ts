/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Airtop from "../../api/index";
import * as core from "../../core";
import { SummaryExperimentalConfig } from "./SummaryExperimentalConfig";

export const SummaryConfig: core.serialization.ObjectSchema<serializers.SummaryConfig.Raw, Airtop.SummaryConfig> =
    core.serialization.object({
        experimental: SummaryExperimentalConfig.optional(),
        outputSchema: core.serialization.string().optional(),
    });

export declare namespace SummaryConfig {
    export interface Raw {
        experimental?: SummaryExperimentalConfig.Raw | null;
        outputSchema?: string | null;
    }
}
