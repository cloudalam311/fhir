"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-underscore-dangle */
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const routeHelper_1 = __importDefault(require("./routeHelper"));
const exportHandler_1 = __importDefault(require("../handlers/exportHandler"));
const exportRouteHelper_1 = __importDefault(require("./exportRouteHelper"));
class ExportRoute {
    constructor(bulkDataAccess, authService, fhirVersion) {
        this.router = express_1.default.Router();
        this.fhirVersion = fhirVersion;
        this.authService = authService;
        this.exportHandler = new exportHandler_1.default(bulkDataAccess, authService);
        this.init();
    }
    async initiateExportRequests(req, res, exportType) {
        const allowedResourceTypes = await this.authService.getAllowedResourceTypesForOperation({
            operation: 'read',
            userIdentity: res.locals.userIdentity,
            requestContext: res.locals.userIdentity,
        });
        const initiateExportRequest = exportRouteHelper_1.default.buildInitiateExportRequest(req, res, exportType, allowedResourceTypes, this.fhirVersion);
        const jobId = await this.exportHandler.initiateExport(initiateExportRequest);
        const exportStatusUrl = `${res.locals.serverUrl}/$export/${jobId}`;
        res.header('Content-Location', exportStatusUrl).status(202).send();
    }
    init() {
        // Start export job
        this.router.get('/\\$export', routeHelper_1.default.wrapAsync(async (req, res) => {
            const exportType = 'system';
            await this.initiateExportRequests(req, res, exportType);
        }));
        this.router.get('/Group/:id/\\$export', routeHelper_1.default.wrapAsync(async (req, res) => {
            const exportType = 'group';
            await this.initiateExportRequests(req, res, exportType);
        }));
        this.router.get('/Patient/\\$export', () => {
            throw new http_errors_1.default.BadRequest('We currently do not support Patient export');
        });
        // Export Job Status
        this.router.get('/\\$export/:jobId', routeHelper_1.default.wrapAsync(async (req, res) => {
            const { userIdentity, requestContext, tenantId } = res.locals;
            const { jobId } = req.params;
            const response = await this.exportHandler.getExportJobStatus(jobId, userIdentity, requestContext, tenantId);
            if (response.jobStatus === 'in-progress') {
                res.status(202).header('x-progress', 'in-progress').send();
            }
            else if (response.jobStatus === 'failed') {
                throw new http_errors_1.default.InternalServerError(response.errorMessage);
            }
            else if (response.jobStatus === 'completed') {
                const { outputFormat, since, type, groupId } = response;
                const queryParams = { outputFormat, since, type };
                const jsonResponse = {
                    transactionTime: response.transactionTime,
                    request: exportRouteHelper_1.default.getExportUrl(res.locals.serverUrl, response.exportType, queryParams, groupId),
                    requiresAccessToken: response.requiresAccessToken,
                    output: response.exportedFileUrls,
                    error: response.errorArray,
                };
                res.status(200).send(jsonResponse);
            }
            else if (response.jobStatus === 'canceled') {
                res.send('Export job has been canceled');
            }
            else if (response.jobStatus === 'canceling') {
                res.send('Export job is being canceled');
            }
        }));
        // Cancel export job
        this.router.delete('/\\$export/:jobId', routeHelper_1.default.wrapAsync(async (req, res) => {
            const { jobId } = req.params;
            const { userIdentity, requestContext, tenantId } = res.locals;
            await this.exportHandler.cancelExport(jobId, userIdentity, requestContext, tenantId);
            res.status(202).send();
        }));
    }
}
exports.default = ExportRoute;
//# sourceMappingURL=exportRoute.js.map