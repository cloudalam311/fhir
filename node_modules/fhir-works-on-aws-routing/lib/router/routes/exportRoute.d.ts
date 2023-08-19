import express, { Router } from 'express';
import { Authorization, BulkDataAccess, ExportType, FhirVersion } from 'fhir-works-on-aws-interface';
export default class ExportRoute {
    readonly router: Router;
    private exportHandler;
    private fhirVersion;
    private authService;
    constructor(bulkDataAccess: BulkDataAccess, authService: Authorization, fhirVersion: FhirVersion);
    initiateExportRequests(req: express.Request, res: express.Response, exportType: ExportType): Promise<void>;
    init(): void;
}
