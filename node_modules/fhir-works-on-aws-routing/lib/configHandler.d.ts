import { FhirConfig, FhirVersion, TypeOperation } from 'fhir-works-on-aws-interface';
import ResourceHandler from './router/handlers/resourceHandler';
export default class ConfigHandler {
    readonly config: FhirConfig;
    readonly supportedGenericResources: string[];
    constructor(config: FhirConfig, supportedGenericResources: string[]);
    isVersionSupported(fhirVersion: FhirVersion): boolean;
    getExcludedResourceTypes(fhirVersion: FhirVersion): string[];
    getSpecialResourceTypes(fhirVersion: FhirVersion): string[];
    getSpecialResourceOperations(resourceType: string, fhirVersion: FhirVersion): TypeOperation[];
    getGenericOperations(fhirVersion: FhirVersion): TypeOperation[];
    getGenericResources(fhirVersion: FhirVersion, specialResources?: string[]): string[];
    /**
     * Get a `ResourceHandler` for a given `resourceType`. The `ResourceHandler` uses the most specific dependencies available in `FhirConfig`:
     * 1. Use the dependencies specific to the given `resourceType` if they are defined.
     * 2. Otherwise use the dependencies for `genericResource` if the given `resourceType` is a valid `genericResource`.
     * 3. Otherwise return undefined.
     */
    getResourceHandler(resourceType: string): ResourceHandler | undefined;
}
