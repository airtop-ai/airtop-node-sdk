/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../index";
import * as Airtop from "../../../../../api/index";
import * as core from "../../../../../core";
import { CreateWindowInputV1BodyWaitUntil } from "../../types/CreateWindowInputV1BodyWaitUntil";

export const CreateWindowInputV1Body: core.serialization.Schema<
    serializers.CreateWindowInputV1Body.Raw,
    Airtop.CreateWindowInputV1Body
> = core.serialization.object({
    screenResolution: core.serialization.string().optional(),
    url: core.serialization.string().optional(),
    waitUntil: CreateWindowInputV1BodyWaitUntil.optional(),
});

export declare namespace CreateWindowInputV1Body {
    interface Raw {
        screenResolution?: string | null;
        url?: string | null;
        waitUntil?: CreateWindowInputV1BodyWaitUntil.Raw | null;
    }
}