import { KeyValueMap, RequestContext } from 'fhir-works-on-aws-interface';
export default interface BundleHandlerInterface {
    processBatch(resource: any, userIdentity: KeyValueMap, requestContext: RequestContext, serverUrl: string, tenantId?: string): any;
    processTransaction(resource: any, userIdentity: KeyValueMap, requestContext: RequestContext, serverUrl: string, tenantId?: string): any;
}
