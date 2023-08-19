import { TypeOperation, SystemOperation, SearchCapabilityStatement, Resource } from 'fhir-works-on-aws-interface';
import { ResourceCapabilityStatement } from '../../registry/ResourceCapabilityInterface';
import { OperationCapabilityStatement } from '../../operationDefinitions/OperationDefinitionRegistry';
export declare function makeOperation(operations: (TypeOperation | SystemOperation)[]): any[];
export declare function makeGenericResources(fhirResourcesToMake: string[], operations: TypeOperation[], searchCapabilityStatement: SearchCapabilityStatement, resourceCapabilityStatement: ResourceCapabilityStatement, operationCapabilityStatement: OperationCapabilityStatement, updateCreate: boolean): any[];
export declare function makeResource(resourceType: string, resource: Resource): Promise<any>;
