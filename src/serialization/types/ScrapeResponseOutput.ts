/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Airtop from "../../api/index";
import * as core from "../../core";
import { ScrapeResponseContent } from "./ScrapeResponseContent";

export const ScrapeResponseOutput: core.serialization.ObjectSchema<
    serializers.ScrapeResponseOutput.Raw,
    Airtop.ScrapeResponseOutput
> = core.serialization.object({
    scrapedContent: ScrapeResponseContent,
    selectedText: core.serialization.string().optional(),
    title: core.serialization.string(),
});

export declare namespace ScrapeResponseOutput {
    export interface Raw {
        scrapedContent: ScrapeResponseContent.Raw;
        selectedText?: string | null;
        title: string;
    }
}
