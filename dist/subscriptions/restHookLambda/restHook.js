import axios from 'axios';
import { makeLogger } from 'fhir-works-on-aws-interface';
import { metricScope, Unit } from 'aws-embedded-metrics';
import https from 'https';
import pSettle from 'p-settle';
import { getAllowListHeaders } from './allowListUtil';
const logger = makeLogger({ component: 'subscriptions' });
const httpsAgent = new https.Agent({
    maxSockets: 100,
    keepAlive: true,
});
const REQUEST_TIMEOUT = 5000;
const MAX_NOTIFICATION_REQUESTS_CONCURRENCY = 10;
axios.defaults.httpsAgent = httpsAgent;
axios.defaults.timeout = REQUEST_TIMEOUT;
/**
 * Merge headers from allow list and subscription resource
 * If same header name is present from both sources, header value in subscription resource will be used
 * If a header string does not have ':', the header will be sent with no value
 * @param allowListHeader
 * @param channelHeader
 */
const mergeRequestHeaders = (allowListHeader, channelHeader) => {
    const mergedHeader = {};
    const mergeHeader = (header) => {
        const colonIndex = header.indexOf(':') === -1 ? header.length : header.indexOf(':');
        const headerKey = header.substring(0, colonIndex);
        mergedHeader[headerKey] = header.substring(colonIndex + 1);
    };
    allowListHeader.forEach((header) => mergeHeader(header));
    channelHeader.forEach((header) => mergeHeader(header));
    return mergedHeader;
};
/**
 * Push latency metric to CloudWatch
 * @param messages
 */
const logLatencyMetric = metricScope((metrics) => async (messages) => {
    const currentTime = new Date().getTime();
    messages.forEach((message) => {
        metrics.putMetric('SubscriptionEndToEndLatency', currentTime - new Date(message.matchedResource.lastUpdated).getTime(), Unit.Milliseconds);
    });
});
export default class RestHookHandler {
    constructor({ enableMultitenancy = false }) {
        this.enableMultitenancy = enableMultitenancy;
    }
    async sendRestHookNotification(event, allowListPromise) {
        logger.debug(allowListPromise);
        const allowList = await allowListPromise;
        logger.debug(allowList);
        const messages = event.Records.map((record) => {
            const body = JSON.parse(record.body);
            return JSON.parse(body.Message);
        });
        // Latency is reported before HTTP call since the external endpoint latency is out of our control.
        await logLatencyMetric(messages);
        const notificationPromiseFns = messages.map((message) => () => {
            const { endpoint, channelHeader, channelPayload, matchedResource, tenantId } = message;
            const allowListHeaders = getAllowListHeaders(allowList, endpoint, {
                enableMultitenancy: this.enableMultitenancy,
                tenantId,
            });
            const headers = mergeRequestHeaders(allowListHeaders, channelHeader);
            if (channelPayload === 'application/fhir+json') {
                return axios.put(`${endpoint}/${matchedResource.resourceType}/${matchedResource.id}`, null, {
                    headers,
                });
            }
            return axios.post(endpoint, null, { headers });
        });
        const results = await pSettle(notificationPromiseFns, { concurrency: MAX_NOTIFICATION_REQUESTS_CONCURRENCY });
        const failures = results.flatMap((settledPromise, i) => {
            if (settledPromise.isRejected) {
                logger.error(settledPromise.reason);
                return [{ itemIdentifier: event.Records[i].messageId }];
            }
            return [];
        });
        logger.info(`Notifications sent: ${results.length - failures.length}`);
        logger.info(`Failed notifications: ${failures.length}`);
        return {
            batchItemFailures: failures,
        };
    }
}
//# sourceMappingURL=restHook.js.map