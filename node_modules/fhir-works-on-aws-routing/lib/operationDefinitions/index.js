"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeOperationRegistry = void 0;
const USCoreDocRef_1 = require("./USCoreDocRef");
const OperationDefinitionRegistry_1 = require("./OperationDefinitionRegistry");
const initializeOperationRegistry = (configHandler) => {
    const { compiledImplementationGuides } = configHandler.config.profile;
    const operations = [];
    // Add the operations to enable on this FHIR server.
    // The recommended approach is to enable operations if the corresponding `OperationDefinition` is found on the `compiledImplementationGuides`,
    // but this file can be updated to use a different enablement criteria or to disable operations altogether.
    if (compiledImplementationGuides &&
        compiledImplementationGuides.find((x) => x.resourceType === 'OperationDefinition' && x.url === USCoreDocRef_1.USCoreDocRef.canonicalUrl)) {
        operations.push(USCoreDocRef_1.USCoreDocRef);
    }
    return new OperationDefinitionRegistry_1.OperationDefinitionRegistry(configHandler, operations);
};
exports.initializeOperationRegistry = initializeOperationRegistry;
//# sourceMappingURL=index.js.map