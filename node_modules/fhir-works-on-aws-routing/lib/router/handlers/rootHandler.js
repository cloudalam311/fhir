"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bundleGenerator_1 = __importDefault(require("../bundle/bundleGenerator"));
const utils_1 = require("./utils");
class RootHandler {
    constructor(searchService, historyService, authService, serverUrl) {
        this.searchService = searchService;
        this.historyService = historyService;
        this.authService = authService;
        this.serverUrl = serverUrl;
    }
    async globalSearch(queryParams, userIdentity, requestContext, serverUrl, tenantId) {
        const searchFilters = await this.authService.getSearchFilterBasedOnIdentity({
            userIdentity,
            requestContext,
            operation: 'search-system',
            fhirServiceBaseUrl: serverUrl,
        });
        const searchResponse = await this.searchService.globalSearch({
            queryParams,
            baseUrl: this.serverUrl,
            searchFilters,
            tenantId,
            sessionId: (0, utils_1.hash)(userIdentity),
        });
        return bundleGenerator_1.default.generateBundle(this.serverUrl, queryParams, searchResponse.result, 'searchset');
    }
    async globalHistory(queryParams, userIdentity, requestContext, serverUrl, tenantId) {
        const searchFilters = await this.authService.getSearchFilterBasedOnIdentity({
            userIdentity,
            requestContext,
            operation: 'history-system',
            fhirServiceBaseUrl: serverUrl,
        });
        const historyResponse = await this.historyService.globalHistory({
            queryParams,
            baseUrl: this.serverUrl,
            searchFilters,
            tenantId,
        });
        return bundleGenerator_1.default.generateBundle(this.serverUrl, queryParams, historyResponse.result, 'history');
    }
}
exports.default = RootHandler;
//# sourceMappingURL=rootHandler.js.map