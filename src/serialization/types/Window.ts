/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Airtop from "../../api/index";
import * as core from "../../core";

export const Window: core.serialization.ObjectSchema<serializers.Window.Raw, Airtop.Window> = core.serialization.object(
    {
        liveViewUrl: core.serialization.string(),
        targetId: core.serialization.string(),
        windowId: core.serialization.string(),
    },
);

export declare namespace Window {
    export interface Raw {
        liveViewUrl: string;
        targetId: string;
        windowId: string;
    }
}
