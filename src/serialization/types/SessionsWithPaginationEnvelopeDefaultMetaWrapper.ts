/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Airtop from "../../api/index";
import * as core from "../../core";
import { SessionsWithPagination } from "./SessionsWithPagination";
import { Issue } from "./Issue";
import { DefaultMetaWrapper } from "./DefaultMetaWrapper";

export const SessionsWithPaginationEnvelopeDefaultMetaWrapper: core.serialization.ObjectSchema<
    serializers.SessionsWithPaginationEnvelopeDefaultMetaWrapper.Raw,
    Airtop.SessionsWithPaginationEnvelopeDefaultMetaWrapper
> = core.serialization.object({
    data: SessionsWithPagination,
    errors: core.serialization.list(Issue).optional(),
    meta: DefaultMetaWrapper,
    warnings: core.serialization.list(Issue).optional(),
});

export declare namespace SessionsWithPaginationEnvelopeDefaultMetaWrapper {
    interface Raw {
        data: SessionsWithPagination.Raw;
        errors?: Issue.Raw[] | null;
        meta: DefaultMetaWrapper.Raw;
        warnings?: Issue.Raw[] | null;
    }
}