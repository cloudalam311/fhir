"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable class-methods-use-this */
const fhir_works_on_aws_interface_1 = require("fhir-works-on-aws-interface");
const http_errors_1 = __importDefault(require("http-errors"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const constants_1 = require("../../constants");
const bundleGenerator_1 = __importDefault(require("./bundleGenerator"));
const bundleParser_1 = __importDefault(require("./bundleParser"));
const validationUtilities_1 = require("../validation/validationUtilities");
class BundleHandler {
    constructor(bundleService, validators, serverUrl, authService, supportedGenericResources, genericResource, resources) {
        this.bundleService = bundleService;
        this.serverUrl = serverUrl;
        this.authService = authService;
        this.supportedGenericResources = supportedGenericResources;
        this.genericResource = genericResource;
        this.resources = resources;
        this.validators = validators;
    }
    async processBatch(bundleRequestJson, userIdentity, requestContext, serverUrl, tenantId) {
        const startTime = new Date();
        const requests = await this.validateBundleResource(bundleRequestJson, userIdentity, requestContext, serverUrl, tenantId);
        let bundleServiceResponse = await this.bundleService.batch({ requests, startTime, tenantId });
        bundleServiceResponse = await this.filterBundleResult(bundleServiceResponse, requests, userIdentity, requestContext, serverUrl);
        return bundleGenerator_1.default.generateBatchBundle(this.serverUrl, bundleServiceResponse.batchReadWriteResponses);
    }
    resourcesInBundleThatServerDoesNotSupport(bundleRequestJson) {
        const bundleEntriesNotSupported = [];
        const resourceTypeToOperations = bundleParser_1.default.getResourceTypeOperationsInBundle(bundleRequestJson);
        if ((0, isEmpty_1.default)(resourceTypeToOperations)) {
            return [];
        }
        // For now, entries in Bundle must be generic resource, because only one persistence obj can be passed into
        // bundleParser
        for (let i = 0; i < Object.keys(resourceTypeToOperations).length; i += 1) {
            const bundleResourceType = Object.keys(resourceTypeToOperations)[i];
            const bundleResourceOperations = resourceTypeToOperations[bundleResourceType];
            // 'Generic resource' includes bundle resourceType and Operation
            if (this.supportedGenericResources.includes(bundleResourceType)) {
                const operationsInBundleThatServerDoesNotSupport = bundleResourceOperations.filter((operation) => {
                    var _a;
                    return !((_a = this.genericResource) === null || _a === void 0 ? void 0 : _a.operations.includes(operation));
                });
                if (operationsInBundleThatServerDoesNotSupport.length > 0) {
                    bundleEntriesNotSupported.push({
                        resource: bundleResourceType,
                        operations: operationsInBundleThatServerDoesNotSupport,
                    });
                }
            }
            else {
                bundleEntriesNotSupported.push({
                    resource: bundleResourceType,
                    operations: bundleResourceOperations,
                });
            }
        }
        return bundleEntriesNotSupported;
    }
    async processTransaction(bundleRequestJson, userIdentity, requestContext, serverUrl, tenantId) {
        const startTime = new Date();
        const requests = await this.validateBundleResource(bundleRequestJson, userIdentity, requestContext, serverUrl, tenantId);
        if (requests.length > constants_1.MAX_BUNDLE_ENTRIES) {
            throw new http_errors_1.default.BadRequest(`Maximum number of entries for a Bundle is ${constants_1.MAX_BUNDLE_ENTRIES}. There are currently ${requests.length} entries in this Bundle`);
        }
        let bundleServiceResponse = await this.bundleService.transaction({ requests, startTime, tenantId });
        bundleServiceResponse = await this.filterBundleResult(bundleServiceResponse, requests, userIdentity, requestContext, serverUrl);
        return bundleGenerator_1.default.generateTransactionBundle(this.serverUrl, bundleServiceResponse.batchReadWriteResponses);
    }
    async validateBundleResource(bundleRequestJson, userIdentity, requestContext, serverUrl, tenantId) {
        await (0, validationUtilities_1.validateResource)(this.validators, 'Bundle', bundleRequestJson, { tenantId });
        let requests;
        try {
            // TODO use the correct persistence layer
            const resourcesServerDoesNotSupport = this.resourcesInBundleThatServerDoesNotSupport(bundleRequestJson);
            if (resourcesServerDoesNotSupport.length > 0) {
                let message = '';
                resourcesServerDoesNotSupport.forEach(({ resource, operations }) => {
                    message += `${resource}: ${operations},`;
                });
                message = message.substring(0, message.length - 1);
                throw new Error(`Server does not support these resource and operations: {${message}}`);
            }
            if (this.genericResource) {
                requests = await bundleParser_1.default.parseResource(bundleRequestJson, this.genericResource.persistence, this.serverUrl);
            }
            else {
                throw new Error('Cannot process bundle');
            }
        }
        catch (e) {
            throw new http_errors_1.default.BadRequest(e.message);
        }
        await this.authService.isBundleRequestAuthorized({
            userIdentity,
            requestContext,
            requests,
            fhirServiceBaseUrl: serverUrl,
        });
        return requests;
    }
    async filterBundleResult(bundleServiceResponse, requests, userIdentity, requestContext, serverUrl) {
        if (!bundleServiceResponse.success) {
            if (bundleServiceResponse.errorType === 'SYSTEM_ERROR') {
                throw new http_errors_1.default.InternalServerError(bundleServiceResponse.message);
            }
            else if (bundleServiceResponse.errorType === 'USER_ERROR') {
                throw new http_errors_1.default.BadRequest(bundleServiceResponse.message);
            }
            else if (bundleServiceResponse.errorType === 'CONFLICT_ERROR') {
                throw new http_errors_1.default.Conflict(bundleServiceResponse.message);
            }
        }
        const readOperations = [
            'read',
            'vread',
            'history-type',
            'history-instance',
            'history-system',
            'search-type',
            'search-system',
        ];
        const authAndFilterReadPromises = requests.map((request, index) => {
            if (readOperations.includes(request.operation)) {
                return this.authService.authorizeAndFilterReadResponse({
                    operation: request.operation,
                    userIdentity,
                    requestContext,
                    readResponse: bundleServiceResponse.batchReadWriteResponses[index].resource,
                    fhirServiceBaseUrl: serverUrl,
                });
            }
            return Promise.resolve();
        });
        const readResponses = await Promise.allSettled(authAndFilterReadPromises);
        requests.forEach((request, index) => {
            const entryResponse = bundleServiceResponse.batchReadWriteResponses[index];
            if (readOperations.includes(request.operation)) {
                const readResponse = readResponses[index];
                if (readResponse.reason && (0, fhir_works_on_aws_interface_1.isUnauthorizedError)(readResponse.reason)) {
                    entryResponse.resource = {};
                }
                else {
                    entryResponse.resource = readResponse.value;
                }
            }
            // eslint-disable-next-line no-param-reassign
            bundleServiceResponse.batchReadWriteResponses[index] = entryResponse;
        });
        return bundleServiceResponse;
    }
}
exports.default = BundleHandler;
//# sourceMappingURL=bundleHandler.js.map