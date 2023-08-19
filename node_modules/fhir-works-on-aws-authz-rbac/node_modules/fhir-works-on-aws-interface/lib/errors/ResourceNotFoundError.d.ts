export declare class ResourceNotFoundError extends Error {
    readonly isResourceNotFoundError: boolean;
    readonly resourceType: string;
    readonly id: string;
    constructor(resourceType: string, id: string, message?: string);
}
export declare function isResourceNotFoundError(error: unknown): error is ResourceNotFoundError;
