import { FhirVersion, TypeOperation, Validator } from 'fhir-works-on-aws-interface';
export default class JsonSchemaValidator implements Validator {
    private ajv;
    private readonly schemaId;
    constructor(fhirVersion: FhirVersion);
    validate(resource: any, params?: {
        tenantId?: string;
        typeOperation?: TypeOperation;
    }): Promise<void>;
}
