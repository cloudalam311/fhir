"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWellKnownUriResponse = exports.camelToSnakeCase = void 0;
const lodash_1 = require("lodash");
function camelToSnakeCase(str) {
    const camelCaseStr = str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    // Handle mis-capitalized first letter, example Red => red
    if (camelCaseStr.substring(0, 1) === '_') {
        return camelCaseStr.substring(1, camelCaseStr.length);
    }
    return camelCaseStr;
}
exports.camelToSnakeCase = camelToSnakeCase;
function getWellKnownUriResponse(smartStrategy) {
    return (0, lodash_1.mapKeys)(smartStrategy, (value, key) => {
        return camelToSnakeCase(key);
    });
}
exports.getWellKnownUriResponse = getWellKnownUriResponse;
//# sourceMappingURL=wellKnownUriHandler.js.map