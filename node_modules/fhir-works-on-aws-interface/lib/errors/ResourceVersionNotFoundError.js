"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isResourceVersionNotFoundError = exports.ResourceVersionNotFoundError = void 0;
// eslint-disable-next-line import/prefer-default-export
class ResourceVersionNotFoundError extends Error {
    constructor(resourceType, id, version, message) {
        const msg = message || `Version "${version}" is not valid for resource ${resourceType}/${id}`;
        // Node Error class requires passing a string message to the parent class
        super(msg);
        Object.setPrototypeOf(this, ResourceVersionNotFoundError.prototype);
        this.resourceType = resourceType;
        this.id = id;
        this.version = version;
        this.name = this.constructor.name;
        this.isResourceVersionNotFoundError = true;
    }
}
exports.ResourceVersionNotFoundError = ResourceVersionNotFoundError;
function isResourceVersionNotFoundError(error) {
    return Boolean(error) && error.isResourceVersionNotFoundError === true;
}
exports.isResourceVersionNotFoundError = isResourceVersionNotFoundError;
//# sourceMappingURL=ResourceVersionNotFoundError.js.map