export declare class TooManyConcurrentExportRequestsError extends Error {
    readonly isTooManyConcurrentExportRequestsError: boolean;
    constructor(message?: string);
}
export declare function isTooManyConcurrentExportRequestsError(error: unknown): error is TooManyConcurrentExportRequestsError;
