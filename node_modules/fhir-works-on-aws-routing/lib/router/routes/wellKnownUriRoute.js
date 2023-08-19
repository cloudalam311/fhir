"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wellKnownUriHandler_1 = require("../handlers/wellKnownUriHandler");
class WellKnownUriRouteRoute {
    constructor(smartStrategy) {
        this.router = express_1.default.Router();
        this.smartStrategy = smartStrategy;
        this.init();
    }
    init() {
        this.router.get('/', async (req, res) => {
            const response = (0, wellKnownUriHandler_1.getWellKnownUriResponse)(this.smartStrategy);
            res.contentType('application/json');
            res.send(response);
        });
    }
}
exports.default = WellKnownUriRouteRoute;
//# sourceMappingURL=wellKnownUriRoute.js.map