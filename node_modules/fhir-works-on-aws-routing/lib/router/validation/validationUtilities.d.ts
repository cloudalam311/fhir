import { TypeOperation, Validator } from 'fhir-works-on-aws-interface';
export declare function validateResource(validators: Validator[], resourceType: string, resource: any, params?: {
    tenantId?: string;
    typeOperation?: TypeOperation;
}): Promise<void>;
