"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
// @ts-ignore
const ajv_errors_1 = __importDefault(require("ajv-errors"));
const lodash_1 = require("lodash");
const fhir_works_on_aws_interface_1 = require("fhir-works-on-aws-interface");
const subscriptionSchema_json_1 = __importDefault(require("./subscriptionSchema.json"));
const SUBSCRIPTION_RESOURCE_TYPE = 'Subscription';
const BUNDLE_RESOURCE_TYPE = 'Bundle';
const SINGLE_TENANT_ALLOW_LIST_KEY = 'SINGLE_TENANT_ALLOW_LIST_KEY';
const DEFAULT_MAX_NUMBER_OF_ACTIVE_SUBSCRIPTIONS = 300;
const isEndpointAllowListed = (allowList, endpoint) => {
    return allowList.some((allowedEndpoint) => {
        if (allowedEndpoint instanceof RegExp) {
            return allowedEndpoint.test(endpoint);
        }
        return allowedEndpoint === endpoint;
    });
};
class SubscriptionValidator {
    constructor(search, persistence, allowList, { enableMultiTenancy = false, maxActiveSubscriptions = DEFAULT_MAX_NUMBER_OF_ACTIVE_SUBSCRIPTIONS, } = {}) {
        this.allowListMap = {};
        this.extractSubscriptionResources = (resource, typeOperation) => {
            const { resourceType } = resource;
            let subscriptionResources = [];
            let numberOfPOSTSubscription = 0;
            let errorMessageIfExceedsNumberLimit = `Number of active subscriptions are exceeding the limit of ${this.maxActiveSubscriptions}`;
            if (resourceType === SUBSCRIPTION_RESOURCE_TYPE) {
                subscriptionResources = [resource];
                numberOfPOSTSubscription = typeOperation === 'create' ? 1 : 0;
            }
            if (resourceType === BUNDLE_RESOURCE_TYPE) {
                subscriptionResources = resource.entry
                    .map((ent) => ent.resource)
                    .filter((singleResource) => singleResource && singleResource.resourceType === SUBSCRIPTION_RESOURCE_TYPE);
                // Here we're NOT considering active subscriptions that might be deleted or deactivated as part of the bundle for simplicity
                numberOfPOSTSubscription = resource.entry.filter((ent) => ent.request.method === 'POST').length;
                errorMessageIfExceedsNumberLimit = `Number of active subscriptions are exceeding the limit of ${this.maxActiveSubscriptions}. Please delete or deactivate subscriptions first, then create new Subscriptions in another request.`;
            }
            return { subscriptionResources, numberOfPOSTSubscription, errorMessageIfExceedsNumberLimit };
        };
        this.search = search;
        this.persistence = persistence;
        this.enableMultiTenancy = enableMultiTenancy;
        this.maxActiveSubscriptions = maxActiveSubscriptions;
        this.loadAllowList(allowList);
        this.ajv = (0, ajv_errors_1.default)(new ajv_1.default({ allErrors: true, jsonPointers: true }));
        this.validateJSON = this.ajv.compile(subscriptionSchema_json_1.default);
    }
    loadAllowList(allowList) {
        if (!this.enableMultiTenancy) {
            this.allowListMap = {
                [SINGLE_TENANT_ALLOW_LIST_KEY]: allowList.map((allowEndpoint) => allowEndpoint.endpoint),
            };
        }
        else {
            const endpointsGroupByTenant = (0, lodash_1.groupBy)(allowList, (allowEndpoint) => allowEndpoint.tenantId);
            Object.entries(endpointsGroupByTenant).forEach(([key, value]) => {
                this.allowListMap[key] = value.map((v) => v.endpoint);
            });
        }
    }
    async validate(resource, { tenantId, typeOperation } = {}) {
        const { subscriptionResources, numberOfPOSTSubscription, errorMessageIfExceedsNumberLimit } = this.extractSubscriptionResources(resource, typeOperation);
        if ((0, lodash_1.isEmpty)(subscriptionResources)) {
            return;
        }
        const numberOfActiveSubscriptions = (await this.persistence.getActiveSubscriptions({ tenantId })).length;
        if (numberOfActiveSubscriptions + numberOfPOSTSubscription > this.maxActiveSubscriptions) {
            throw new fhir_works_on_aws_interface_1.InvalidResourceError(errorMessageIfExceedsNumberLimit);
        }
        const allowList = this.getAllowListForRequest(tenantId);
        subscriptionResources.forEach((res) => {
            const result = this.validateJSON(res);
            if (!result) {
                throw new fhir_works_on_aws_interface_1.InvalidResourceError(`Subscription resource is not valid. Error was: ${this.ajv.errorsText(this.validateJSON.errors)}`);
            }
            if (!isEndpointAllowListed(allowList, res.channel.endpoint)) {
                throw new fhir_works_on_aws_interface_1.InvalidResourceError(`Subscription resource is not valid. Endpoint ${res.channel.endpoint} is not allow listed.`);
            }
            this.search.validateSubscriptionSearchCriteria(res.criteria);
        });
    }
    getAllowListForRequest(tenantId) {
        if (this.enableMultiTenancy) {
            if (tenantId !== undefined) {
                return this.allowListMap[tenantId];
            }
            throw new Error('This instance has multi-tenancy enabled, but the incoming request is missing tenantId');
        }
        else {
            if (tenantId === undefined) {
                return this.allowListMap[SINGLE_TENANT_ALLOW_LIST_KEY];
            }
            throw new Error('This instance has multi-tenancy disabled, but the incoming request has a tenantId');
        }
    }
}
exports.default = SubscriptionValidator;
//# sourceMappingURL=subscriptionValidator.js.map