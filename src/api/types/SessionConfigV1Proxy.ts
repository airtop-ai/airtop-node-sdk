/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Airtop from "../index";

/**
 * Proxy configuration.
 */
export type SessionConfigV1Proxy =
    /**
     * Use Airtop-provided proxy. */
    | boolean
    /**
     * Configuration for a single custom proxy. */
    | Airtop.Proxy
    /**
     * You can set multiple proxies. You associate each proxy with a domain pattern. If the domain matches the pattern, the proxy is used. Pattern can contain `?` to match any single character and / or `*` to match any sequence of characters. For example, `*.example.com` will match `www.example.com` and `sub.example.com`. */
    | Airtop.ProxyConfigurationKind[];
