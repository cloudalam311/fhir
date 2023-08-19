"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingImplementationGuides = void 0;
/**
 * This class compiles StructuredDefinitions from IG packages
 */
class RoutingImplementationGuides {
    /**
     * Compiles the contents of an Implementation Guide into an internal representation used to build the Capability Statement
     *
     * @param resources - an array of FHIR resources. See: https://www.hl7.org/fhir/profiling.html
     */
    // eslint-disable-next-line class-methods-use-this
    async compile(resources) {
        const validDefinitions = [];
        resources.forEach((s) => {
            if (RoutingImplementationGuides.isFhirStructureDefinition(s) ||
                RoutingImplementationGuides.isFhirOperationDefinition(s)) {
                validDefinitions.push(s);
            }
            else {
                throw new Error(`The following input is not a StructureDefinition nor a OperationDefinition: ${s.type} ${s.name}`);
            }
        });
        return validDefinitions.map((fhirDefinition) => {
            switch (fhirDefinition.resourceType) {
                case 'StructureDefinition':
                    return {
                        name: fhirDefinition.name,
                        url: fhirDefinition.url,
                        type: fhirDefinition.type,
                        resourceType: fhirDefinition.resourceType,
                        description: fhirDefinition.description,
                        baseDefinition: fhirDefinition.baseDefinition,
                    };
                case 'OperationDefinition':
                    return {
                        name: fhirDefinition.name,
                        url: fhirDefinition.url,
                        resourceType: fhirDefinition.resourceType,
                        description: fhirDefinition.description,
                    };
                default:
                    // this should never happen
                    throw new Error('Unexpected error');
            }
        });
    }
    static isFhirStructureDefinition(x) {
        return (typeof x === 'object' &&
            x &&
            x.resourceType === 'StructureDefinition' &&
            typeof x.url === 'string' &&
            typeof x.name === 'string' &&
            typeof x.description === 'string' &&
            typeof x.baseDefinition === 'string' &&
            typeof x.type === 'string');
    }
    static isFhirOperationDefinition(x) {
        return (typeof x === 'object' &&
            x &&
            x.resourceType === 'OperationDefinition' &&
            typeof x.url === 'string' &&
            typeof x.name === 'string' &&
            typeof x.description === 'string');
    }
}
exports.RoutingImplementationGuides = RoutingImplementationGuides;
//# sourceMappingURL=index.js.map