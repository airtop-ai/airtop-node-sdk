/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Airtop from "../../api/index";
import * as core from "../../core";
import { Proxy } from "./Proxy";

export const ProxyConfigurationKind: core.serialization.ObjectSchema<
    serializers.ProxyConfigurationKind.Raw,
    Airtop.ProxyConfigurationKind
> = core.serialization.object({
    domainPattern: core.serialization.string(),
    relay: Proxy,
});

export declare namespace ProxyConfigurationKind {
    export interface Raw {
        domainPattern: string;
        relay: Proxy.Raw;
    }
}
