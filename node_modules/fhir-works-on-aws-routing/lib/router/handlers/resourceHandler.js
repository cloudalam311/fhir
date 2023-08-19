"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bundleGenerator_1 = __importDefault(require("../bundle/bundleGenerator"));
const operationsGenerator_1 = __importDefault(require("../operationsGenerator"));
const validationUtilities_1 = require("../validation/validationUtilities");
const utils_1 = require("./utils");
class ResourceHandler {
    constructor(dataService, searchService, historyService, authService, serverUrl, validators) {
        this.validators = validators;
        this.dataService = dataService;
        this.searchService = searchService;
        this.historyService = historyService;
        this.authService = authService;
    }
    async create(resourceType, resource, tenantId) {
        await (0, validationUtilities_1.validateResource)(this.validators, resourceType, resource, { tenantId, typeOperation: 'create' });
        const createResponse = await this.dataService.createResource({ resourceType, resource, tenantId });
        return createResponse.resource;
    }
    async update(resourceType, id, resource, tenantId) {
        await (0, validationUtilities_1.validateResource)(this.validators, resourceType, resource, { tenantId, typeOperation: 'update' });
        const updateResponse = await this.dataService.updateResource({ resourceType, id, resource, tenantId });
        return updateResponse.resource;
    }
    async patch(resourceType, id, resource, tenantId) {
        // TODO Add request validation around patching
        const patchResponse = await this.dataService.patchResource({ resourceType, id, resource, tenantId });
        return patchResponse.resource;
    }
    async typeSearch(resourceType, queryParams, userIdentity, requestContext, serverUrl, tenantId) {
        const allowedResourceTypes = await this.authService.getAllowedResourceTypesForOperation({
            operation: 'search-type',
            userIdentity,
            requestContext,
        });
        const searchFilters = await this.authService.getSearchFilterBasedOnIdentity({
            userIdentity,
            requestContext,
            operation: 'search-type',
            resourceType,
            fhirServiceBaseUrl: serverUrl,
        });
        const searchResponse = await this.searchService.typeSearch({
            resourceType,
            queryParams,
            baseUrl: serverUrl,
            allowedResourceTypes,
            searchFilters,
            tenantId,
            sessionId: (0, utils_1.hash)(userIdentity),
        });
        const bundle = bundleGenerator_1.default.generateBundle(serverUrl, queryParams, searchResponse.result, 'searchset', resourceType);
        return this.authService.authorizeAndFilterReadResponse({
            operation: 'search-type',
            userIdentity,
            requestContext,
            readResponse: bundle,
            fhirServiceBaseUrl: serverUrl,
        });
    }
    async typeHistory(resourceType, queryParams, userIdentity, requestContext, serverUrl, tenantId) {
        const searchFilters = await this.authService.getSearchFilterBasedOnIdentity({
            userIdentity,
            requestContext,
            operation: 'history-type',
            resourceType,
            fhirServiceBaseUrl: serverUrl,
        });
        const historyResponse = await this.historyService.typeHistory({
            resourceType,
            queryParams,
            baseUrl: serverUrl,
            searchFilters,
            tenantId,
        });
        return bundleGenerator_1.default.generateBundle(serverUrl, queryParams, historyResponse.result, 'history', resourceType);
    }
    async instanceHistory(resourceType, id, queryParams, userIdentity, requestContext, serverUrl, tenantId) {
        const searchFilters = await this.authService.getSearchFilterBasedOnIdentity({
            userIdentity,
            requestContext,
            operation: 'history-instance',
            resourceType,
            id,
            fhirServiceBaseUrl: serverUrl,
        });
        const historyResponse = await this.historyService.instanceHistory({
            id,
            resourceType,
            queryParams,
            baseUrl: serverUrl,
            searchFilters,
            tenantId,
        });
        return bundleGenerator_1.default.generateBundle(serverUrl, queryParams, historyResponse.result, 'history', resourceType, id);
    }
    async read(resourceType, id, tenantId) {
        const getResponse = await this.dataService.readResource({ resourceType, id, tenantId });
        return getResponse.resource;
    }
    async vRead(resourceType, id, vid, tenantId) {
        const getResponse = await this.dataService.vReadResource({ resourceType, id, vid, tenantId });
        return getResponse.resource;
    }
    async delete(resourceType, id, tenantId) {
        await this.dataService.deleteResource({ resourceType, id, tenantId });
        return operationsGenerator_1.default.generateSuccessfulDeleteOperation();
    }
}
exports.default = ResourceHandler;
//# sourceMappingURL=resourceHandler.js.map