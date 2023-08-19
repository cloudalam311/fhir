import { Search, History, Persistence, Authorization, KeyValueMap, Validator, RequestContext } from 'fhir-works-on-aws-interface';
import CrudHandlerInterface from './CrudHandlerInterface';
export default class ResourceHandler implements CrudHandlerInterface {
    private validators;
    private dataService;
    private searchService;
    private historyService;
    private authService;
    constructor(dataService: Persistence, searchService: Search, historyService: History, authService: Authorization, serverUrl: string, validators: Validator[]);
    create(resourceType: string, resource: any, tenantId?: string): Promise<any>;
    update(resourceType: string, id: string, resource: any, tenantId?: string): Promise<any>;
    patch(resourceType: string, id: string, resource: any, tenantId?: string): Promise<any>;
    typeSearch(resourceType: string, queryParams: any, userIdentity: KeyValueMap, requestContext: RequestContext, serverUrl: string, tenantId?: string): Promise<any>;
    typeHistory(resourceType: string, queryParams: any, userIdentity: KeyValueMap, requestContext: RequestContext, serverUrl: string, tenantId?: string): Promise<{
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
    instanceHistory(resourceType: string, id: string, queryParams: any, userIdentity: KeyValueMap, requestContext: RequestContext, serverUrl: string, tenantId?: string): Promise<{
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
    read(resourceType: string, id: string, tenantId?: string): Promise<any>;
    vRead(resourceType: string, id: string, vid: string, tenantId?: string): Promise<any>;
    delete(resourceType: string, id: string, tenantId?: string): Promise<{
        resourceType: string;
        text: {
            status: string;
            div: string;
        };
        issue: {
            severity: string;
            code: string;
            diagnostics: string;
        }[];
    }>;
}
