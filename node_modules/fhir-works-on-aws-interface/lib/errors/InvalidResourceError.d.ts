export declare class InvalidResourceError extends Error {
    readonly isInvalidResourceError: boolean;
    constructor(message?: string);
}
export declare function isInvalidResourceError(error: unknown): error is InvalidResourceError;
