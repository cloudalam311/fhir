"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setContentTypeMiddleware = void 0;
/**
 * Set default content-type to 'application/fhir+json'
 */
const setContentTypeMiddleware = (req, res, next) => {
    try {
        res.contentType(req.headers.accept === 'application/json' ? 'application/json' : 'application/fhir+json');
        next();
    }
    catch (e) {
        next(e);
    }
};
exports.setContentTypeMiddleware = setContentTypeMiddleware;
//# sourceMappingURL=setContentType.js.map