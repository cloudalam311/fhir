"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
function makeStatement(rest, productInfo, url, fhirVersion) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const cap = {
        resourceType: 'CapabilityStatement',
        name: (_a = productInfo.productMachineName) !== null && _a !== void 0 ? _a : 'FhirServerCapabilityStatement',
        title: `${(_b = productInfo.productTitle) !== null && _b !== void 0 ? _b : 'Fhir Server'} Capability Statement`,
        description: (_c = productInfo.productDescription) !== null && _c !== void 0 ? _c : `A FHIR ${fhirVersion} Server Capability Statement`,
        purpose: (_d = productInfo.productPurpose) !== null && _d !== void 0 ? _d : `A statement of this system's capabilities`,
        copyright: (_e = productInfo.copyright) !== null && _e !== void 0 ? _e : undefined,
        status: 'active',
        date: new Date().toISOString(),
        publisher: productInfo.orgName,
        kind: 'instance',
        software: {
            name: (_f = productInfo.productTitle) !== null && _f !== void 0 ? _f : 'FHIR Server',
            version: (_g = productInfo.productVersion) !== null && _g !== void 0 ? _g : '1.0.0',
        },
        implementation: {
            description: (_h = productInfo.productDescription) !== null && _h !== void 0 ? _h : `A FHIR ${fhirVersion} Server`,
            url,
        },
        fhirVersion,
        format: ['json'],
        rest: [rest],
    };
    // TODO finalize
    if (fhirVersion !== '4.0.1') {
        cap.acceptUnknown = 'no';
    }
    return cap;
}
exports.default = makeStatement;
//# sourceMappingURL=cap.template.js.map