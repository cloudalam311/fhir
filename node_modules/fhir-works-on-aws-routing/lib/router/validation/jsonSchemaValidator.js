"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
const ajv_1 = __importDefault(require("ajv"));
const json_schema_draft_06_json_1 = __importDefault(require("ajv/lib/refs/json-schema-draft-06.json"));
const json_schema_draft_04_json_1 = __importDefault(require("ajv/lib/refs/json-schema-draft-04.json"));
const fhir_works_on_aws_interface_1 = require("fhir-works-on-aws-interface");
const fhir_schema_v4_json_1 = __importDefault(require("./schemas/fhir.schema.v4.json"));
const fhir_schema_v3_json_1 = __importDefault(require("./schemas/fhir.schema.v3.json"));
class JsonSchemaValidator {
    constructor(fhirVersion) {
        const ajv = new ajv_1.default({ schemaId: 'auto', allErrors: true });
        let schema;
        if (fhirVersion === '4.0.1') {
            ajv.addMetaSchema(json_schema_draft_06_json_1.default);
            ajv.compile(fhir_schema_v4_json_1.default);
            schema = fhir_schema_v4_json_1.default;
        }
        else if (fhirVersion === '3.0.1') {
            ajv.addMetaSchema(json_schema_draft_04_json_1.default);
            ajv.compile(fhir_schema_v3_json_1.default);
            schema = fhir_schema_v3_json_1.default;
        }
        this.schemaId = schema && 'id' in schema ? schema.id : '';
        this.ajv = ajv;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async validate(resource, params = {}) {
        const definitionName = resource.resourceType;
        if (!definitionName) {
            throw new fhir_works_on_aws_interface_1.InvalidResourceError("resource should have required property 'resourceType'");
        }
        const referenceName = `${this.schemaId}#/definitions/${definitionName}`;
        const result = this.ajv.validate(referenceName, resource);
        if (!result) {
            throw new fhir_works_on_aws_interface_1.InvalidResourceError(`Failed to parse request body as JSON resource. Error was: ${this.ajv.errorsText()}`);
        }
    }
}
exports.default = JsonSchemaValidator;
//# sourceMappingURL=jsonSchemaValidator.js.map