"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDocRefParamsToSearchParams = void 0;
const convertDocRefParamsToSearchParams = (docRefParams) => {
    const { patient, start, end, type, onDemand } = docRefParams;
    if (onDemand) {
        // This implementation is not capable of generating documents on the fly. Just return an empty Bundle.
        return { _count: '0' };
    }
    let searchParams = {
        patient,
    };
    if (!start && !end) {
        // only latest document
        searchParams = { _sort: '-period,-date', _count: '1', ...searchParams };
    }
    else {
        const dateParams = [];
        if (start) {
            dateParams.push(`ge${start}`);
        }
        if (end) {
            dateParams.push(`le${end}`);
        }
        searchParams = { period: dateParams, ...searchParams };
    }
    let tokenParam;
    if (type) {
        tokenParam = type.system ? `${type.system}|${type.code}` : type.code;
    }
    else {
        // The LOINC code for a C-CDA Clinical Summary of Care (CCD) is 34133-9 (Summary of episode note)
        tokenParam = 'http://loinc.org|34133-9';
    }
    searchParams = { type: tokenParam, ...searchParams };
    return searchParams;
};
exports.convertDocRefParamsToSearchParams = convertDocRefParamsToSearchParams;
//# sourceMappingURL=convertDocRefParamsToSearchParams.js.map