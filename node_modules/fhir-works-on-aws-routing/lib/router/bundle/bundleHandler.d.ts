import { BatchReadWriteRequest, Bundle, Authorization, GenericResource, Resources, TypeOperation, KeyValueMap, Validator, RequestContext } from 'fhir-works-on-aws-interface';
import BundleHandlerInterface from './bundleHandlerInterface';
export default class BundleHandler implements BundleHandlerInterface {
    private bundleService;
    private validators;
    readonly serverUrl: string;
    private authService;
    private genericResource?;
    private resources?;
    private supportedGenericResources;
    constructor(bundleService: Bundle, validators: Validator[], serverUrl: string, authService: Authorization, supportedGenericResources: string[], genericResource?: GenericResource, resources?: Resources);
    processBatch(bundleRequestJson: any, userIdentity: KeyValueMap, requestContext: RequestContext, serverUrl: string, tenantId?: string): Promise<{
        resourceType: string;
        id: string;
        type: string;
        link: {
            relation: string;
            url: string;
        }[];
        entry: never[];
    }>;
    resourcesInBundleThatServerDoesNotSupport(bundleRequestJson: any): {
        resource: string;
        operations: TypeOperation[];
    }[];
    processTransaction(bundleRequestJson: any, userIdentity: KeyValueMap, requestContext: RequestContext, serverUrl: string, tenantId?: string): Promise<{
        resourceType: string;
        id: string;
        type: string;
        link: {
            relation: string;
            url: string;
        }[];
        entry: never[];
    }>;
    validateBundleResource(bundleRequestJson: any, userIdentity: KeyValueMap, requestContext: RequestContext, serverUrl: string, tenantId?: string): Promise<BatchReadWriteRequest[]>;
    filterBundleResult(bundleServiceResponse: any, requests: any[], userIdentity: KeyValueMap, requestContext: RequestContext, serverUrl: string): Promise<any>;
}
