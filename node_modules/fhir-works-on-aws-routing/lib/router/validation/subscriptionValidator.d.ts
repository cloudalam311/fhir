import { Validator, Search, Persistence, TypeOperation } from 'fhir-works-on-aws-interface';
export interface SubscriptionEndpoint {
    endpoint: string | RegExp;
    headers?: string[];
    tenantId?: string;
}
export default class SubscriptionValidator implements Validator {
    private ajv;
    private readonly validateJSON;
    private search;
    private persistence;
    private allowListMap;
    private readonly enableMultiTenancy;
    private readonly maxActiveSubscriptions;
    constructor(search: Search, persistence: Persistence, allowList: SubscriptionEndpoint[], { enableMultiTenancy, maxActiveSubscriptions, }?: {
        enableMultiTenancy?: boolean;
        maxActiveSubscriptions?: number;
    });
    loadAllowList(allowList: SubscriptionEndpoint[]): void;
    validate(resource: any, { tenantId, typeOperation }?: {
        tenantId?: string;
        typeOperation?: TypeOperation;
    }): Promise<void>;
    private extractSubscriptionResources;
    private getAllowListForRequest;
}
