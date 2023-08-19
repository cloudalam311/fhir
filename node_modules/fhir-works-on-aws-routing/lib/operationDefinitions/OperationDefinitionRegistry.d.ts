import { Router } from 'express';
import { OperationDefinitionImplementation } from './types';
import ConfigHandler from '../configHandler';
export interface OperationCapability {
    operation: {
        name: string;
        definition: string;
        documentation: string;
    }[];
}
export interface OperationCapabilityStatement {
    [resourceType: string]: OperationCapability;
}
export declare class OperationDefinitionRegistry {
    private readonly operations;
    private readonly routers;
    constructor(configHandler: ConfigHandler, operations: OperationDefinitionImplementation[]);
    getOperation(method: string, path: string): OperationDefinitionImplementation | undefined;
    getAllRouters(): Router[];
    getCapabilities(): OperationCapabilityStatement;
}
