"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationDefinitionRegistry = void 0;
class OperationDefinitionRegistry {
    constructor(configHandler, operations) {
        this.operations = operations;
        this.routers = operations.map((operation) => {
            const resourceHandler = configHandler.getResourceHandler(operation.targetResourceType);
            if (!resourceHandler) {
                throw new Error(`Failed to initialize operation ${operation.canonicalUrl}. Is your FhirConfig correct?`);
            }
            console.log(`Enabling operation ${operation.canonicalUrl} at ${operation.path}`);
            return operation.buildRouter(resourceHandler);
        });
    }
    getOperation(method, path) {
        return this.operations.find((o) => o.path === path && o.httpVerbs.includes(method));
    }
    getAllRouters() {
        return this.routers;
    }
    getCapabilities() {
        const capabilities = {};
        this.operations.forEach((operation) => {
            if (!capabilities[operation.targetResourceType]) {
                capabilities[operation.targetResourceType] = {
                    operation: [],
                };
            }
            capabilities[operation.targetResourceType].operation.push({
                name: operation.name,
                definition: operation.canonicalUrl,
                documentation: operation.documentation,
            });
        });
        return capabilities;
    }
}
exports.OperationDefinitionRegistry = OperationDefinitionRegistry;
//# sourceMappingURL=OperationDefinitionRegistry.js.map