import { Capabilities, CapabilitiesRequest, GenericResponse } from 'fhir-works-on-aws-interface';
import ConfigHandler from '../../configHandler';
import { FHIRStructureDefinitionRegistry } from '../../registry';
import { OperationDefinitionRegistry } from '../../operationDefinitions/OperationDefinitionRegistry';
export default class MetadataHandler implements Capabilities {
    configHandler: ConfigHandler;
    readonly hasCORSEnabled: boolean;
    readonly registry: FHIRStructureDefinitionRegistry;
    readonly operationRegistry: OperationDefinitionRegistry;
    constructor(handler: ConfigHandler, registry: FHIRStructureDefinitionRegistry, operationRegistry: OperationDefinitionRegistry, hasCORSEnabled?: boolean);
    private generateResources;
    capabilities(request: CapabilitiesRequest): Promise<GenericResponse>;
}
