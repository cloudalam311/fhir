"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fhir_works_on_aws_interface_1 = require("fhir-works-on-aws-interface");
const AWS_1 = __importDefault(require("../../AWS"));
const loggerBuilder_1 = __importDefault(require("../../loggerBuilder"));
// a relatively high number to give cold starts a chance to succeed
const TIMEOUT_MILLISECONDS = 25000;
const logger = (0, loggerBuilder_1.default)();
class HapiFhirLambdaValidator {
    constructor(hapiValidatorLambdaArn) {
        this.hapiValidatorLambdaArn = hapiValidatorLambdaArn;
        this.lambdaClient = new AWS_1.default.Lambda({
            httpOptions: {
                timeout: TIMEOUT_MILLISECONDS,
            },
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async validate(resource, params = {}) {
        const lambdaParams = {
            FunctionName: this.hapiValidatorLambdaArn,
            InvocationType: 'RequestResponse',
            Payload: JSON.stringify(JSON.stringify(resource)),
        };
        const lambdaResponse = await this.lambdaClient.invoke(lambdaParams).promise();
        if (lambdaResponse.FunctionError) {
            // this means that the lambda function crashed, not necessarily that the resource is invalid.
            const msg = `The execution of ${this.hapiValidatorLambdaArn} lambda function failed`;
            logger.error(msg, lambdaResponse);
            throw new Error(msg);
        }
        // response payload is always a string. the Payload type is also used for invoke parameters
        const hapiValidatorResponse = JSON.parse(lambdaResponse.Payload);
        if (hapiValidatorResponse.successful) {
            return;
        }
        const allErrorMessages = hapiValidatorResponse.errorMessages
            .filter((e) => e.severity === 'error')
            .map((e) => e.msg)
            .join('\n');
        throw new fhir_works_on_aws_interface_1.InvalidResourceError(allErrorMessages);
    }
}
exports.default = HapiFhirLambdaValidator;
//# sourceMappingURL=hapiFhirLambdaValidator.js.map