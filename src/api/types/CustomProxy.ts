/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Airtop from "../index";

/**
 * Configuration for a single custom proxy.
 */
export type CustomProxy =
    /**
     * url of the proxy. Or "default" to use airtop provided proxy. */
    | string
    /**
     * Proxy object with url of the proxy as a parameter. Takes optional username and password. */
    | Airtop.Proxy;
