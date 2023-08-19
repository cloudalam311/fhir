"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeResource = exports.makeGenericResources = exports.makeOperation = void 0;
function makeResourceObject(resourceType, resourceOperations, updateCreate, hasTypeSearch, searchCapabilities, resourceCapability, operationCapability) {
    const result = {
        type: resourceType,
        interaction: resourceOperations,
        versioning: 'versioned',
        readHistory: false,
        updateCreate,
        conditionalCreate: false,
        conditionalRead: 'not-supported',
        conditionalUpdate: false,
        conditionalDelete: 'not-supported',
    };
    if (hasTypeSearch && searchCapabilities !== undefined) {
        Object.assign(result, searchCapabilities);
    }
    if (resourceCapability) {
        Object.assign(result, resourceCapability);
    }
    if (operationCapability) {
        Object.assign(result, operationCapability);
    }
    return result;
}
function makeOperation(operations) {
    const resourceOperations = [];
    operations.forEach((operation) => {
        resourceOperations.push({ code: operation });
    });
    return resourceOperations;
}
exports.makeOperation = makeOperation;
function makeGenericResources(fhirResourcesToMake, operations, searchCapabilityStatement, resourceCapabilityStatement, operationCapabilityStatement, updateCreate) {
    const resources = [];
    const resourceOperations = makeOperation(operations);
    const hasTypeSearch = operations.includes('search-type');
    fhirResourcesToMake.forEach((resourceType) => {
        resources.push(makeResourceObject(resourceType, resourceOperations, updateCreate, hasTypeSearch, searchCapabilityStatement[resourceType], resourceCapabilityStatement[resourceType], operationCapabilityStatement[resourceType]));
    });
    return resources;
}
exports.makeGenericResources = makeGenericResources;
async function makeResource(resourceType, resource) {
    const resourceOperations = makeOperation(resource.operations);
    const hasTypeSearch = resource.operations.includes('search-type');
    const updateCreate = resource.persistence.updateCreateSupported;
    const capabilities = hasTypeSearch ? await resource.typeSearch.getCapabilities() : {};
    return makeResourceObject(resourceType, resourceOperations, updateCreate, hasTypeSearch, capabilities[resourceType]);
}
exports.makeResource = makeResource;
//# sourceMappingURL=cap.rest.resource.template.js.map