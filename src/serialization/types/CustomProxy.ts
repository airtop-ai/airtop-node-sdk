/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Airtop from "../../api/index";
import * as core from "../../core";
import { Proxy } from "./Proxy";

export const CustomProxy: core.serialization.Schema<serializers.CustomProxy.Raw, Airtop.CustomProxy> =
    core.serialization.undiscriminatedUnion([core.serialization.string(), Proxy]);

export declare namespace CustomProxy {
    type Raw = string | Proxy.Raw;
}
