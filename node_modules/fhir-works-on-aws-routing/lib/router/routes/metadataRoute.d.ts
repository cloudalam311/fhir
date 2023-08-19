import { Router } from 'express';
import { FhirVersion } from 'fhir-works-on-aws-interface';
import ConfigHandler from '../../configHandler';
import { FHIRStructureDefinitionRegistry } from '../../registry';
import { OperationDefinitionRegistry } from '../../operationDefinitions/OperationDefinitionRegistry';
export default class MetadataRoute {
    readonly fhirVersion: FhirVersion;
    readonly router: Router;
    private metadataHandler;
    constructor(fhirVersion: FhirVersion, fhirConfigHandler: ConfigHandler, registry: FHIRStructureDefinitionRegistry, operationRegistry: OperationDefinitionRegistry, hasCORSEnabled: boolean);
    private init;
}
