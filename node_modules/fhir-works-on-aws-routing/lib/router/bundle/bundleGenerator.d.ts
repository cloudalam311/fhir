import { SearchResult, BatchReadWriteResponse } from 'fhir-works-on-aws-interface';
declare type LinkType = 'self' | 'previous' | 'next' | 'first' | 'last';
export default class BundleGenerator {
    static generateBundle(baseUrl: string, queryParams: any, searchResult: SearchResult, bundleType: 'searchset' | 'history', resourceType?: string, id?: string): {
        resourceType: string;
        id: string;
        meta: {
            lastUpdated: string;
        };
        type: "history" | "searchset";
        total: number;
        link: {
            relation: LinkType;
            url: string;
        }[];
        entry: import("fhir-works-on-aws-interface").SearchEntry[];
    };
    static createLinkWithQuery(linkType: LinkType, host: string, isHistory: boolean, resourceType?: string, id?: string, query?: any): {
        relation: LinkType;
        url: string;
    };
    static createLink(linkType: LinkType, url: string): {
        relation: LinkType;
        url: string;
    };
    static generateGenericBundle(baseUrl: string, bundleEntryResponses: BatchReadWriteResponse[], bundleType: string): {
        resourceType: string;
        id: string;
        type: string;
        link: {
            relation: string;
            url: string;
        }[];
        entry: never[];
    };
    static generateTransactionBundle(baseUrl: string, bundleEntryResponses: BatchReadWriteResponse[]): {
        resourceType: string;
        id: string;
        type: string;
        link: {
            relation: string;
            url: string;
        }[];
        entry: never[];
    };
    static generateBatchBundle(baseUrl: string, bundleEntryResponses: BatchReadWriteResponse[]): {
        resourceType: string;
        id: string;
        type: string;
        link: {
            relation: string;
            url: string;
        }[];
        entry: never[];
    };
}
export {};
