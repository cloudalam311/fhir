"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FHIRStructureDefinitionRegistry = void 0;
/**
 * This class is the single authority over the supported FHIR StructuredDefinition and their definitions
 */
class FHIRStructureDefinitionRegistry {
    constructor(compiledImplementationGuides) {
        let compiledStructureDefinitions = [];
        if (compiledImplementationGuides !== undefined) {
            compiledStructureDefinitions = [
                ...compiledImplementationGuides.filter((x) => x.resourceType === 'StructureDefinition'),
            ];
        }
        this.capabilityStatement = {};
        compiledStructureDefinitions.forEach((compiledStructureDefinition) => {
            const structuredDefinition = this.capabilityStatement[compiledStructureDefinition.type];
            if (structuredDefinition) {
                this.capabilityStatement[compiledStructureDefinition.type].supportedProfile.push(compiledStructureDefinition.url);
            }
            else {
                this.capabilityStatement[compiledStructureDefinition.type] = {
                    type: compiledStructureDefinition.type,
                    supportedProfile: [compiledStructureDefinition.url],
                };
            }
        });
    }
    /**
     * Retrieve the profiles for a given resource type. Returns undefined if the parameter is not found on the registry.
     * @param resourceType FHIR resource type
     * @return a list of profiles
     */
    getProfiles(resourceType) {
        var _a, _b;
        return (_b = (_a = this.capabilityStatement[resourceType]) === null || _a === void 0 ? void 0 : _a.supportedProfile) !== null && _b !== void 0 ? _b : [];
    }
    /**
     * Retrieve a subset of the CapabilityStatement with the resource definitions
     * See https://www.hl7.org/fhir/capabilitystatement.html
     */
    getCapabilities() {
        return this.capabilityStatement;
    }
}
exports.FHIRStructureDefinitionRegistry = FHIRStructureDefinitionRegistry;
//# sourceMappingURL=index.js.map