"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
class ExportHandler {
    constructor(bulkDataAccess, authService) {
        this.bulkDataAccess = bulkDataAccess;
        this.authService = authService;
    }
    async initiateExport(initiateExportRequest) {
        return this.bulkDataAccess.initiateExport(initiateExportRequest);
    }
    async getExportJobStatus(jobId, userIdentity, requestContext, tenantId) {
        const jobDetails = await this.bulkDataAccess.getExportStatus(jobId, tenantId);
        await this.checkIfRequesterHasAccessToJob(jobDetails, userIdentity, requestContext);
        return jobDetails;
    }
    async cancelExport(jobId, userIdentity, requestContext, tenantId) {
        const jobDetails = await this.bulkDataAccess.getExportStatus(jobId, tenantId);
        await this.checkIfRequesterHasAccessToJob(jobDetails, userIdentity, requestContext);
        if (['completed', 'failed'].includes(jobDetails.jobStatus)) {
            throw new http_errors_1.default.BadRequest(`Job cannot be canceled because job is already in ${jobDetails.jobStatus} state`);
        }
        await this.bulkDataAccess.cancelExport(jobId, tenantId);
    }
    async checkIfRequesterHasAccessToJob(jobDetails, userIdentity, requestContext) {
        const { jobOwnerId } = jobDetails;
        const accessBulkDataJobRequest = { userIdentity, requestContext, jobOwnerId };
        await this.authService.isAccessBulkDataJobAllowed(accessBulkDataJobRequest);
    }
}
exports.default = ExportHandler;
//# sourceMappingURL=exportHandler.js.map