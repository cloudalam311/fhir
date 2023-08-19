/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
import serverless from 'serverless-http';
import { generateServerlessRouter } from 'fhir-works-on-aws-routing';
import { getFhirConfig, genericResources } from './config';
export const ensureAsyncInit = async (initPromise) => {
    try {
        await initPromise;
    }
    catch (e) {
        console.error('Async initialization failed', e);
        // Explicitly exit the process so that next invocation re-runs the init code.
        // This prevents Lambda containers from caching a rejected init promise
        process.exit(1);
    }
};
async function asyncServerless() {
    return serverless(generateServerlessRouter(await getFhirConfig(), genericResources), {
        request(request, event) {
            request.user = event.user;
        },
    });
}
const serverlessHandler = asyncServerless();
export const handler = async (event = {}, context = {}) => {
    await ensureAsyncInit(serverlessHandler);
    return (await serverlessHandler)(event, context);
};
//# sourceMappingURL=index.js.map