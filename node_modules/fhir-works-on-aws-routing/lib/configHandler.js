"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resourceHandler_1 = __importDefault(require("./router/handlers/resourceHandler"));
class ConfigHandler {
    constructor(config, supportedGenericResources) {
        this.config = config;
        this.supportedGenericResources = supportedGenericResources;
    }
    isVersionSupported(fhirVersion) {
        return this.config.profile.fhirVersion === fhirVersion;
    }
    getExcludedResourceTypes(fhirVersion) {
        const { genericResource } = this.config.profile;
        if (genericResource && genericResource.fhirVersions.includes(fhirVersion)) {
            if (fhirVersion === '3.0.1') {
                return genericResource.excludedSTU3Resources || [];
            }
            if (fhirVersion === '4.0.1') {
                return genericResource.excludedR4Resources || [];
            }
        }
        return [];
    }
    getSpecialResourceTypes(fhirVersion) {
        const { resources } = this.config.profile;
        if (resources) {
            let specialResources = Object.keys(resources);
            specialResources = specialResources.filter((r) => resources[r].fhirVersions.includes(fhirVersion));
            return specialResources;
        }
        return [];
    }
    getSpecialResourceOperations(resourceType, fhirVersion) {
        const { resources } = this.config.profile;
        if (resources && resources[resourceType] && resources[resourceType].fhirVersions.includes(fhirVersion)) {
            return resources[resourceType].operations;
        }
        return [];
    }
    getGenericOperations(fhirVersion) {
        const { genericResource } = this.config.profile;
        if (genericResource && genericResource.fhirVersions.includes(fhirVersion)) {
            return genericResource.operations;
        }
        return [];
    }
    getGenericResources(fhirVersion, specialResources = []) {
        const excludedResources = this.getExcludedResourceTypes(fhirVersion);
        const resources = this.supportedGenericResources.filter((r) => !excludedResources.includes(r) && !specialResources.includes(r));
        return resources;
    }
    /**
     * Get a `ResourceHandler` for a given `resourceType`. The `ResourceHandler` uses the most specific dependencies available in `FhirConfig`:
     * 1. Use the dependencies specific to the given `resourceType` if they are defined.
     * 2. Otherwise use the dependencies for `genericResource` if the given `resourceType` is a valid `genericResource`.
     * 3. Otherwise return undefined.
     */
    getResourceHandler(resourceType) {
        var _a;
        if ((_a = this.config.profile.resources) === null || _a === void 0 ? void 0 : _a[resourceType]) {
            const { persistence, typeSearch, typeHistory } = this.config.profile.resources[resourceType];
            return new resourceHandler_1.default(persistence, typeSearch, typeHistory, this.config.auth.authorization, this.config.server.url, this.config.validators);
        }
        if (this.getGenericResources(this.config.profile.fhirVersion).includes(resourceType) &&
            this.config.profile.genericResource) {
            const { persistence, typeSearch, typeHistory } = this.config.profile.genericResource;
            return new resourceHandler_1.default(persistence, typeSearch, typeHistory, this.config.auth.authorization, this.config.server.url, this.config.validators);
        }
        return undefined;
    }
}
exports.default = ConfigHandler;
//# sourceMappingURL=configHandler.js.map