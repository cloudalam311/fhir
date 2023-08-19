import { TypeOperation, Validator } from 'fhir-works-on-aws-interface';
export default class HapiFhirLambdaValidator implements Validator {
    private hapiValidatorLambdaArn;
    private lambdaClient;
    constructor(hapiValidatorLambdaArn: string);
    validate(resource: any, params?: {
        tenantId?: string;
        typeOperation?: TypeOperation;
    }): Promise<void>;
}
