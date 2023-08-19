import { Search, History, KeyValueMap, Authorization, RequestContext } from 'fhir-works-on-aws-interface';
export default class RootHandler {
    private searchService;
    private historyService;
    private authService;
    private serverUrl;
    constructor(searchService: Search, historyService: History, authService: Authorization, serverUrl: string);
    globalSearch(queryParams: any, userIdentity: KeyValueMap, requestContext: RequestContext, serverUrl: string, tenantId?: string): Promise<{
        resourceType: string;
        id: string;
        meta: {
            lastUpdated: string;
        };
        type: "history" | "searchset";
        total: number;
        link: {
            relation: "next" | "self" | "previous" | "first" | "last";
            url: string;
        }[];
        entry: import("fhir-works-on-aws-interface").SearchEntry[];
    }>;
    globalHistory(queryParams: any, userIdentity: KeyValueMap, requestContext: RequestContext, serverUrl: string, tenantId?: string): Promise<{
        resourceType: string;
        id: string;
        meta: {
            lastUpdated: string;
        };
        type: "history" | "searchset";
        total: number;
        link: {
            relation: "next" | "self" | "previous" | "first" | "last";
            url: string;
        }[];
        entry: import("fhir-works-on-aws-interface").SearchEntry[];
    }>;
}
