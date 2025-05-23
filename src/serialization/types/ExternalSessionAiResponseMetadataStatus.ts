/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Airtop from "../../api/index";
import * as core from "../../core";

export const ExternalSessionAiResponseMetadataStatus: core.serialization.Schema<
    serializers.ExternalSessionAiResponseMetadataStatus.Raw,
    Airtop.ExternalSessionAiResponseMetadataStatus
> = core.serialization.enum_(["success", "partial", "failure"]);

export declare namespace ExternalSessionAiResponseMetadataStatus {
    export type Raw = "success" | "partial" | "failure";
}
