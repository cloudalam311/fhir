"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const isString_1 = __importDefault(require("lodash/isString"));
const regExpressions_1 = require("../../regExpressions");
class ExportRouteHelper {
    static buildInitiateExportRequest(req, res, exportType, allowedResourceTypes, fhirVersion) {
        if (req.query._outputFormat && req.query._outputFormat !== 'ndjson') {
            throw new http_errors_1.default.BadRequest('We only support exporting resources into ndjson formatted file');
        }
        if (req.headers.prefer && req.headers.prefer !== 'respond-async') {
            throw new http_errors_1.default.BadRequest('We only support asyncronous export job request');
        }
        if ((req.query._since && !(0, isString_1.default)(req.query._since)) ||
            (req.query._since && (0, isString_1.default)(req.query._since) && !regExpressions_1.dateTimeWithTimeZoneRegExp.test(req.query._since))) {
            throw new http_errors_1.default.BadRequest("Query '_since' should be in the FHIR Instant format: YYYY-MM-DDThh:mm:ss.sss+zz:zz (e.g. 2015-02-07T13:28:17.239+02:00 or 2017-01-01T00:00:00Z)");
        }
        const { userIdentity } = res.locals;
        const initiateExportRequest = {
            requesterUserId: userIdentity.sub,
            exportType,
            transactionTime: new Date().toISOString(),
            outputFormat: (0, isString_1.default)(req.query._outputFormat) ? req.query._outputFormat : undefined,
            since: (0, isString_1.default)(req.query._since) && regExpressions_1.dateTimeWithTimeZoneRegExp.test(req.query._since)
                ? new Date(req.query._since).toISOString()
                : undefined,
            type: (0, isString_1.default)(req.query._type) ? req.query._type : undefined,
            groupId: (0, isString_1.default)(req.params.id) ? req.params.id : undefined,
            tenantId: res.locals.tenantId,
            serverUrl: res.locals.serverUrl,
            fhirVersion,
            allowedResourceTypes,
        };
        return initiateExportRequest;
    }
    static getExportUrl(baseUrl, exportType, queryParams, groupId) {
        const { outputFormat, since, type } = queryParams;
        const url = new URL(baseUrl);
        url.pathname += url.pathname.endsWith('/') ? '' : '/';
        if (exportType === 'system') {
            url.pathname += '$export';
        }
        if (exportType === 'patient') {
            url.pathname += 'Patient/$export';
        }
        if (exportType === 'group') {
            url.pathname += `Group/${groupId}/$export`;
        }
        if (outputFormat) {
            url.searchParams.append('_outputFormat', outputFormat);
        }
        if (since) {
            url.searchParams.append('_since', since);
        }
        if (type) {
            url.searchParams.append('_type', type);
        }
        return url.toString();
    }
}
exports.default = ExportRouteHelper;
//# sourceMappingURL=exportRouteHelper.js.map