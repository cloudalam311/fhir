"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTooManyConcurrentExportRequestsError = exports.TooManyConcurrentExportRequestsError = void 0;
class TooManyConcurrentExportRequestsError extends Error {
    constructor(message = 'Too Many Concurrent Export Requests') {
        // Node Error class requires passing a string message to the parent class
        super(message);
        Object.setPrototypeOf(this, TooManyConcurrentExportRequestsError.prototype);
        this.isTooManyConcurrentExportRequestsError = true;
        this.name = this.constructor.name;
    }
}
exports.TooManyConcurrentExportRequestsError = TooManyConcurrentExportRequestsError;
function isTooManyConcurrentExportRequestsError(error) {
    return (Boolean(error) &&
        error.isTooManyConcurrentExportRequestsError === true);
}
exports.isTooManyConcurrentExportRequestsError = isTooManyConcurrentExportRequestsError;
//# sourceMappingURL=TooManyConcurrentExportRequestsError.js.map