export declare class UnauthorizedError extends Error {
    readonly isUnauthorizedError: boolean;
    constructor(message?: string);
}
export declare function isUnauthorizedError(error: unknown): error is UnauthorizedError;
