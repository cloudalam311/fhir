export interface DocRefParams {
    patient: string;
    start?: string;
    end?: string;
    type?: {
        system?: string;
        code: string;
    };
    onDemand?: boolean;
}
export declare const parseQueryParams: (queryParams: any) => DocRefParams;
export declare const parsePostParams: (postParams: any) => DocRefParams;
