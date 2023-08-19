import { Authorization, BulkDataAccess, GetExportStatusResponse, InitiateExportRequest, KeyValueMap, RequestContext } from 'fhir-works-on-aws-interface';
export default class ExportHandler {
    private bulkDataAccess;
    private authService;
    constructor(bulkDataAccess: BulkDataAccess, authService: Authorization);
    initiateExport(initiateExportRequest: InitiateExportRequest): Promise<string>;
    getExportJobStatus(jobId: string, userIdentity: KeyValueMap, requestContext: RequestContext, tenantId?: string): Promise<GetExportStatusResponse>;
    cancelExport(jobId: string, userIdentity: KeyValueMap, requestContext: RequestContext, tenantId?: string): Promise<void>;
    private checkIfRequesterHasAccessToJob;
}
