/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Airtop from "../../api/index";
import * as core from "../../core";

export const PageQueryConfig: core.serialization.ObjectSchema<serializers.PageQueryConfig.Raw, Airtop.PageQueryConfig> =
    core.serialization.object({
        outputSchema: core.serialization.string().optional(),
    });

export declare namespace PageQueryConfig {
    interface Raw {
        outputSchema?: string | null;
    }
}