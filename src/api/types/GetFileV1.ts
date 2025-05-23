/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Airtop from "../index";

export interface GetFileV1 {
    /** URL to download the file */
    downloadUrl: string;
    /** Time when the file will be automatically deleted. Typically 48 hours after the file is uploaded */
    expiryTime?: Date;
    /** Size of the file in bytes */
    fileBytes: number;
    /** Name of the file */
    fileName: string;
    /** Type of the file */
    fileType: Airtop.GetFileV1FileType;
    /** ID of the file */
    id: string;
    /** ID of the organization */
    orgId: string;
    /** IDs of the associated sessions */
    sessionIds?: string[];
    /** Status of the file */
    status: Airtop.GetFileV1Status;
    /** Time when the file upload was started */
    uploadStartTime: Date;
}
