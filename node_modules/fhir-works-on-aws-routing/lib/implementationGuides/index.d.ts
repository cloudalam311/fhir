import { ImplementationGuides } from 'fhir-works-on-aws-interface';
/**
 * Based on the FHIR StructuredDefinition. This type only includes the fields that are required for the compile process.
 * See: http://www.hl7.org/fhir/structuredefinition.html
 */
export declare type FhirStructureDefinition = {
    resourceType: 'StructureDefinition';
    url: string;
    name: string;
    description: string;
    baseDefinition: string;
    type: string;
};
/**
 * Based on the FHIR OperationDefinition. This type only includes the fields that are required for the compile process.
 * See: https://www.hl7.org/fhir/operationdefinition.html
 */
export declare type FhirOperationDefinition = {
    resourceType: 'OperationDefinition';
    url: string;
    name: string;
    description: string;
};
/**
 * This class compiles StructuredDefinitions from IG packages
 */
export declare class RoutingImplementationGuides implements ImplementationGuides {
    /**
     * Compiles the contents of an Implementation Guide into an internal representation used to build the Capability Statement
     *
     * @param resources - an array of FHIR resources. See: https://www.hl7.org/fhir/profiling.html
     */
    compile(resources: any[]): Promise<any>;
    private static isFhirStructureDefinition;
    private static isFhirOperationDefinition;
}
