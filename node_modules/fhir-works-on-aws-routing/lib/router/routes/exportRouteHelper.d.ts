import express from 'express';
import { ExportType, FhirVersion, InitiateExportRequest } from 'fhir-works-on-aws-interface';
export default class ExportRouteHelper {
    static buildInitiateExportRequest(req: express.Request, res: express.Response, exportType: ExportType, allowedResourceTypes: string[], fhirVersion?: FhirVersion): InitiateExportRequest;
    static getExportUrl(baseUrl: string, exportType: ExportType, queryParams: {
        outputFormat?: string;
        since?: string;
        type?: string;
    }, groupId?: string): string;
}
