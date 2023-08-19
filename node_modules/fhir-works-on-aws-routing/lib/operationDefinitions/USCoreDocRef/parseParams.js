"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePostParams = exports.parseQueryParams = void 0;
const ajv_1 = __importDefault(require("ajv"));
const http_errors_1 = __importDefault(require("http-errors"));
// @ts-ignore
const ajv_errors_1 = __importDefault(require("ajv-errors"));
const ajv = (0, ajv_errors_1.default)(new ajv_1.default({ allErrors: true, jsonPointers: true }));
const queryParamsSchema = {
    type: 'object',
    properties: {
        patient: { type: 'string' },
        start: { type: 'string' },
        end: { type: 'string' },
        'on-demand': { enum: ['true', 'false'] },
    },
    required: ['patient'],
    additionalProperties: {
        not: true,
        // eslint-disable-next-line no-template-curly-in-string
        errorMessage: 'Invalid parameter: ${0#}',
    },
    errorMessage: {
        properties: {
            'on-demand': 'should be true or false',
        },
    },
};
const validateQueryParams = ajv.compile(queryParamsSchema);
const parseQueryParams = (queryParams) => {
    if (queryParams.type) {
        // This will likely be a common error, so we add a very specific message.
        throw new http_errors_1.default.BadRequest('"type" parameter is not allowed on a GET request. Use POST instead');
    }
    if (!validateQueryParams(queryParams)) {
        throw new http_errors_1.default.BadRequest(ajv.errorsText(validateQueryParams.errors, { dataVar: 'params' }));
    }
    const docRefParams = {
        patient: queryParams.patient,
    };
    if (queryParams.start) {
        docRefParams.start = queryParams.start;
    }
    if (queryParams.end) {
        docRefParams.end = queryParams.end;
    }
    if (queryParams['on-demand']) {
        docRefParams.onDemand = queryParams['on-demand'] === 'true';
    }
    return docRefParams;
};
exports.parseQueryParams = parseQueryParams;
const postParamsSchema = {
    $schema: 'http://json-schema.org/draft-07/schema',
    type: 'object',
    required: ['resourceType', 'parameter'],
    properties: {
        resourceType: {
            const: 'Parameters',
            errorMessage: 'should equal "Parameters"',
        },
        id: {
            type: 'string',
        },
        parameter: {
            errorMessage: 'must be an array of parameters with names and types as specified on http://www.hl7.org/fhir/us/core/OperationDefinition-docref.html',
            type: 'array',
            minItems: 1,
            maxItems: 5,
            items: {
                anyOf: [
                    {
                        type: 'object',
                        required: ['name', 'valueCodeableConcept'],
                        properties: {
                            name: {
                                const: 'codeableConcept',
                            },
                            valueCodeableConcept: {
                                type: 'object',
                                required: ['coding'],
                                properties: {
                                    coding: {
                                        required: ['code'],
                                        type: 'object',
                                        properties: {
                                            system: {
                                                type: 'string',
                                            },
                                            code: {
                                                type: 'string',
                                            },
                                            display: {
                                                type: 'string',
                                            },
                                        },
                                        additionalProperties: false,
                                    },
                                },
                                additionalProperties: false,
                            },
                        },
                        additionalProperties: false,
                    },
                    {
                        type: 'object',
                        required: ['name', 'valueId'],
                        properties: {
                            name: {
                                const: 'patient',
                            },
                            valueId: {
                                type: 'string',
                            },
                        },
                        additionalProperties: false,
                    },
                    {
                        type: 'object',
                        required: ['name', 'valueDate'],
                        properties: {
                            name: {
                                enum: ['start', 'end'],
                            },
                            valueDate: {
                                type: 'string',
                            },
                        },
                        additionalProperties: false,
                    },
                    {
                        type: 'object',
                        required: ['name', 'valueBoolean'],
                        properties: {
                            name: {
                                const: 'on-demand',
                            },
                            valueBoolean: {
                                type: 'boolean',
                            },
                        },
                        additionalProperties: false,
                    },
                    {
                        type: 'object',
                        required: ['name', 'valueId'],
                        properties: {
                            name: {
                                const: 'patient',
                            },
                            valueId: {
                                type: 'string',
                            },
                        },
                        additionalProperties: false,
                    },
                ],
            },
        },
    },
    additionalProperties: {
        not: true,
        errorMessage: 'is not a valid property',
    },
};
const validatePostParams = ajv.compile(postParamsSchema);
const parsePostParams = (postParams) => {
    if (!validatePostParams(postParams)) {
        throw new http_errors_1.default.BadRequest(ajv.errorsText(validatePostParams.errors, { dataVar: 'params' }));
    }
    const params = postParams.parameter;
    const allowedNames = ['patient', 'start', 'end', 'on-demand', 'codeableConcept'];
    const docRefParams = {};
    allowedNames.forEach((name) => {
        const matches = params.filter((param) => param.name === name);
        if (matches.length > 1) {
            throw new http_errors_1.default.BadRequest('parameter names cannot repeat');
        }
        if (name === 'patient' && matches.length === 0) {
            throw new http_errors_1.default.BadRequest('patient parameter is required');
        }
        if (matches.length === 0) {
            return;
        }
        switch (name) {
            case 'patient':
                docRefParams[name] = matches[0].valueId;
                break;
            case 'start':
            case 'end':
                docRefParams[name] = matches[0].valueDate;
                break;
            case 'on-demand':
                docRefParams.onDemand = matches[0].valueBoolean;
                break;
            case 'codeableConcept':
                docRefParams.type = {
                    system: matches[0].valueCodeableConcept.coding.system,
                    code: matches[0].valueCodeableConcept.coding.code,
                };
                break;
            default:
                // this should never happen
                throw new Error('Unable to parse params');
        }
    });
    return docRefParams;
};
exports.parsePostParams = parsePostParams;
//# sourceMappingURL=parseParams.js.map