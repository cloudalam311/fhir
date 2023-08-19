"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknownErrorHandler = exports.httpErrorHandler = exports.applicationErrorMapper = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const fhir_works_on_aws_interface_1 = require("fhir-works-on-aws-interface");
const operationsGenerator_1 = __importDefault(require("../operationsGenerator"));
const applicationErrorMapper = (err, req, res, next) => {
    console.error(err);
    if ((0, fhir_works_on_aws_interface_1.isResourceNotFoundError)(err)) {
        next(new http_errors_1.default.NotFound(err.message));
        return;
    }
    if ((0, fhir_works_on_aws_interface_1.isResourceVersionNotFoundError)(err)) {
        next(new http_errors_1.default.NotFound(err.message));
        return;
    }
    if ((0, fhir_works_on_aws_interface_1.isInvalidResourceError)(err)) {
        next(new http_errors_1.default.BadRequest(err.message));
        return;
    }
    if ((0, fhir_works_on_aws_interface_1.isUnauthorizedError)(err)) {
        next(new http_errors_1.default.Unauthorized(err.message));
        return;
    }
    if ((0, fhir_works_on_aws_interface_1.isTooManyConcurrentExportRequestsError)(err)) {
        next(new http_errors_1.default.TooManyRequests('There is currently too many requests. Please try again later'));
        return;
    }
    if ((0, fhir_works_on_aws_interface_1.isInvalidSearchParameterError)(err)) {
        next(new http_errors_1.default.BadRequest(err.message));
        return;
    }
    if ((0, fhir_works_on_aws_interface_1.isResourceConflictError)(err)) {
        next(new http_errors_1.default.Conflict(err.message));
        return;
    }
    next(err);
};
exports.applicationErrorMapper = applicationErrorMapper;
const statusToOutcome = {
    400: { severity: 'error', code: 'invalid' },
    401: { severity: 'error', code: 'security' },
    403: { severity: 'error', code: 'security' },
    404: { severity: 'error', code: 'not-found' },
    409: { severity: 'error', code: 'conflict' },
    429: { severity: 'error', code: 'throttled' },
    500: { severity: 'error', code: 'exception' },
};
const httpErrorHandler = (err, req, res, next) => {
    var _a;
    if (err instanceof http_errors_1.default.TooManyRequests) {
        const RETRY_AGAIN_IN_SECONDS = 15 * 60; // 15 Minutes
        res.header('Retry-After', RETRY_AGAIN_IN_SECONDS.toString(10));
    }
    if (http_errors_1.default.isHttpError(err)) {
        console.error('HttpError', err);
        const { severity, code } = (_a = statusToOutcome[err.statusCode]) !== null && _a !== void 0 ? _a : { severity: 'error', code: 'processing' };
        res.status(err.statusCode).send(operationsGenerator_1.default.generateOperationOutcomeIssue(severity, code, err.message));
        return;
    }
    next(err);
};
exports.httpErrorHandler = httpErrorHandler;
const unknownErrorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    console.error('Unhandled Error', err);
    const msg = 'Internal server error';
    res.status(500).send(operationsGenerator_1.default.generateOperationOutcomeIssue('error', 'exception', msg));
};
exports.unknownErrorHandler = unknownErrorHandler;
//# sourceMappingURL=errorHandling.js.map