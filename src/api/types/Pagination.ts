/**
 * This file was auto-generated by Fern from our API Definition.
 */

export interface Pagination {
    /** The number of items to return */
    currentLimit: number;
    /** The current page number */
    currentPage: number;
    /** The final count of items displayed on the current page */
    finalCount: number;
    /** Whether there are more items */
    hasMore: boolean;
    /** The initial count of items displayed on the current page */
    initialCount: number;
    /** The number of items to skip */
    nextOffset: number;
    /** The total number of pages */
    numberOfPages: number;
    /** The total number of items */
    totalItems: number;
}
