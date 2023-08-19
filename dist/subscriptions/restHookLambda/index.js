/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 *
 */
import RestHookHandler from './restHook';
import { getAllowListInfo } from './allowListUtil';
const enableMultitenancy = process.env.ENABLE_MULTI_TENANCY === 'true';
const allowListPromise = getAllowListInfo({
    enableMultitenancy,
});
const restHookHandler = new RestHookHandler({ enableMultitenancy });
exports.handler = async (event) => {
    return restHookHandler.sendRestHookNotification(event, allowListPromise);
};
//# sourceMappingURL=index.js.map