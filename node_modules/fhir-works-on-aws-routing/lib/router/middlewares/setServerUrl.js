"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setServerUrlMiddleware = void 0;
const routeHelper_1 = __importDefault(require("../routes/routeHelper"));
/**
 * Sets the value of `res.locals.serverUrl`
 * the serverUrl can either be a static value from FhirConfig of a dynamic value for some multi-tenancy setups.
 */
const setServerUrlMiddleware = (fhirConfig) => {
    return routeHelper_1.default.wrapAsync(async (req, res, next) => {
        if (req.baseUrl && req.baseUrl !== '/') {
            res.locals.serverUrl = fhirConfig.server.url + req.baseUrl;
        }
        else {
            res.locals.serverUrl = fhirConfig.server.url;
        }
        next();
    });
};
exports.setServerUrlMiddleware = setServerUrlMiddleware;
//# sourceMappingURL=setServerUrl.js.map