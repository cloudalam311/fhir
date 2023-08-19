"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInvalidResourceError = exports.InvalidResourceError = void 0;
// eslint-disable-next-line import/prefer-default-export
class InvalidResourceError extends Error {
    constructor(message = 'Invalid Resource') {
        // Node Error class requires passing a string message to the parent class
        super(message);
        Object.setPrototypeOf(this, InvalidResourceError.prototype);
        this.isInvalidResourceError = true;
        this.name = this.constructor.name;
    }
}
exports.InvalidResourceError = InvalidResourceError;
function isInvalidResourceError(error) {
    return Boolean(error) && error.isInvalidResourceError === true;
}
exports.isInvalidResourceError = isInvalidResourceError;
//# sourceMappingURL=InvalidResourceError.js.map