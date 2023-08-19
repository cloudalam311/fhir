"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUnauthorizedError = exports.UnauthorizedError = void 0;
// eslint-disable-next-line import/prefer-default-export
class UnauthorizedError extends Error {
    constructor(message = 'Forbidden') {
        // Node Error class requires passing a string message to the parent class
        super(message);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
        this.name = this.constructor.name;
        this.isUnauthorizedError = true;
    }
}
exports.UnauthorizedError = UnauthorizedError;
function isUnauthorizedError(error) {
    return Boolean(error) && error.isUnauthorizedError === true;
}
exports.isUnauthorizedError = isUnauthorizedError;
//# sourceMappingURL=UnauthorizedError.js.map