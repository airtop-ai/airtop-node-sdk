/**
 * This file was auto-generated by Fern from our API Definition.
 */

export interface ExternalSessionConfig {
    /** Id of a profile to use with this session */
    baseProfileId?: string;
    /** Persist the profile */
    persistProfile?: boolean;
    /** Max length of session in minutes, after which it will terminate if not already deleted */
    timeoutMinutes?: number;
}