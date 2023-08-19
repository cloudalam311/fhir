"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const cap_rest_resource_template_1 = require("./cap.rest.resource.template");
const cap_rest_security_template_1 = __importDefault(require("./cap.rest.security.template"));
const cap_rest_template_1 = __importDefault(require("./cap.rest.template"));
const cap_template_1 = __importDefault(require("./cap.template"));
class MetadataHandler {
    constructor(handler, registry, operationRegistry, hasCORSEnabled = false) {
        this.configHandler = handler;
        this.hasCORSEnabled = hasCORSEnabled;
        this.registry = registry;
        this.operationRegistry = operationRegistry;
    }
    async generateResources(fhirVersion) {
        const specialResourceTypes = this.configHandler.getSpecialResourceTypes(fhirVersion);
        let generatedResources = [];
        if (this.configHandler.config.profile.genericResource) {
            const updateCreate = this.configHandler.config.profile.genericResource.persistence.updateCreateSupported;
            const generatedResourcesTypes = this.configHandler.getGenericResources(fhirVersion, specialResourceTypes);
            generatedResources = (0, cap_rest_resource_template_1.makeGenericResources)(generatedResourcesTypes, this.configHandler.getGenericOperations(fhirVersion), await this.configHandler.config.profile.genericResource.typeSearch.getCapabilities(), await this.registry.getCapabilities(), await this.operationRegistry.getCapabilities(), updateCreate);
        }
        // Add the special resources
        generatedResources.push(...(await Promise.all(specialResourceTypes.map((resourceType) => (0, cap_rest_resource_template_1.makeResource)(resourceType, this.configHandler.config.profile.resources[resourceType])))));
        return generatedResources;
    }
    async capabilities(request) {
        const { auth, productInfo, server, profile } = this.configHandler.config;
        if (!this.configHandler.isVersionSupported(request.fhirVersion)) {
            throw new http_errors_1.default.NotFound(`FHIR version ${request.fhirVersion} is not supported`);
        }
        const generatedResources = await this.generateResources(request.fhirVersion);
        const security = (0, cap_rest_security_template_1.default)(auth, this.hasCORSEnabled);
        const rest = (0, cap_rest_template_1.default)(generatedResources, security, profile.systemOperations, !!profile.bulkDataAccess);
        const capStatement = (0, cap_template_1.default)(rest, productInfo, server.url, request.fhirVersion);
        return {
            message: 'success',
            resource: capStatement,
        };
    }
}
exports.default = MetadataHandler;
//# sourceMappingURL=metadataHandler.js.map