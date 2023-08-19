export declare class ResourceVersionNotFoundError extends Error {
    readonly isResourceVersionNotFoundError: boolean;
    readonly resourceType: string;
    readonly id: string;
    readonly version: string;
    constructor(resourceType: string, id: string, version: string, message?: string);
}
export declare function isResourceVersionNotFoundError(error: unknown): error is ResourceVersionNotFoundError;
