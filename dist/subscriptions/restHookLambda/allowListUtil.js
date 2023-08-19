import { groupBy } from 'lodash';
import getAllowListedSubscriptionEndpoints from '../allowList';
const SINGLE_TENANT_ALLOW_LIST_KEY = 'SINGLE_TENANT_ALLOW_LIST_KEY';
const extractAllowListInfo = (subscriptionEndpoints) => {
    const allowList = [];
    const headerMap = {};
    subscriptionEndpoints.forEach((allowEndpoint) => {
        allowList.push(allowEndpoint.endpoint);
        headerMap[allowEndpoint.endpoint.toString()] = allowEndpoint.headers || [];
    });
    return { allowList, headerMap };
};
export async function getAllowListInfo({ enableMultitenancy = false, }) {
    const originalAllowList = await getAllowListedSubscriptionEndpoints();
    if (!enableMultitenancy) {
        return { [SINGLE_TENANT_ALLOW_LIST_KEY]: extractAllowListInfo(originalAllowList) };
    }
    const allowListInfo = {};
    const endpointsGroupByTenant = groupBy(originalAllowList, (allowEndpoint) => allowEndpoint.tenantId);
    Object.entries(endpointsGroupByTenant).forEach(([key, value]) => {
        allowListInfo[key] = extractAllowListInfo(value);
    });
    return allowListInfo;
}
/**
 * Verify endpoint is allow listed
 * Return allow list headers if endpoint is allow listed
 * Throw error if endpoint is not allow listed
 * @param allowListInfoMap
 * @param endpoint
 * @param tenantId
 * @param enableMultitenancy
 */
export const getAllowListHeaders = (allowListInfoMap, endpoint, { enableMultitenancy = false, tenantId }) => {
    const getHeaders = (allowListInfo) => {
        if (allowListInfo) {
            const { allowList, headerMap } = allowListInfo;
            // eslint-disable-next-line no-restricted-syntax
            for (const allowedEndpoint of allowList) {
                if (allowedEndpoint instanceof RegExp && allowedEndpoint.test(endpoint)) {
                    return headerMap[allowedEndpoint.toString()];
                }
                if (allowedEndpoint === endpoint) {
                    return headerMap[allowedEndpoint];
                }
            }
        }
        throw new Error(`Endpoint ${endpoint} is not allow listed.`);
    };
    if (enableMultitenancy) {
        if (tenantId) {
            return getHeaders(allowListInfoMap[tenantId]);
        }
        throw new Error('This instance has multi-tenancy enabled, but the incoming request is missing tenantId');
    }
    if (!tenantId) {
        return getHeaders(allowListInfoMap[SINGLE_TENANT_ALLOW_LIST_KEY]);
    }
    throw new Error('This instance has multi-tenancy disabled, but the incoming request has a tenantId');
};
//# sourceMappingURL=allowListUtil.js.map