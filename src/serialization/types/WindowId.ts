/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Airtop from "../../api/index";
import * as core from "../../core";

export const WindowId: core.serialization.ObjectSchema<serializers.WindowId.Raw, Airtop.WindowId> =
    core.serialization.object({
        targetId: core.serialization.string(),
        title: core.serialization.string().optional(),
        url: core.serialization.string().optional(),
        windowId: core.serialization.string(),
    });

export declare namespace WindowId {
    export interface Raw {
        targetId: string;
        title?: string | null;
        url?: string | null;
        windowId: string;
    }
}
