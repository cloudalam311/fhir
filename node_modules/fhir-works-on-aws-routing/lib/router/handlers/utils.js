"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = void 0;
const crypto_1 = require("crypto");
const hash = (o) => (0, crypto_1.createHash)('sha256').update(JSON.stringify(o)).digest('hex');
exports.hash = hash;
//# sourceMappingURL=utils.js.map