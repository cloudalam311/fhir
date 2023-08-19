import { ResourceCapabilityStatement } from './ResourceCapabilityInterface';
/**
 * This class is the single authority over the supported FHIR StructuredDefinition and their definitions
 */
export declare class FHIRStructureDefinitionRegistry {
    private readonly capabilityStatement;
    constructor(compiledImplementationGuides?: any[]);
    /**
     * Retrieve the profiles for a given resource type. Returns undefined if the parameter is not found on the registry.
     * @param resourceType FHIR resource type
     * @return a list of profiles
     */
    getProfiles(resourceType: string): string[];
    /**
     * Retrieve a subset of the CapabilityStatement with the resource definitions
     * See https://www.hl7.org/fhir/capabilitystatement.html
     */
    getCapabilities(): ResourceCapabilityStatement;
}
