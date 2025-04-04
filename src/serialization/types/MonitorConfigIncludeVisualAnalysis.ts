/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Airtop from "../../api/index";
import * as core from "../../core";

export const MonitorConfigIncludeVisualAnalysis: core.serialization.Schema<
    serializers.MonitorConfigIncludeVisualAnalysis.Raw,
    Airtop.MonitorConfigIncludeVisualAnalysis
> = core.serialization.enum_(["auto", "disabled", "enabled"]);

export declare namespace MonitorConfigIncludeVisualAnalysis {
    export type Raw = "auto" | "disabled" | "enabled";
}
