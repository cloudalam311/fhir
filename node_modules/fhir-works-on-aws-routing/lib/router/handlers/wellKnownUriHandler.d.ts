/// <reference types="lodash" />
import { SmartStrategy } from 'fhir-works-on-aws-interface';
export declare function camelToSnakeCase(str: string): string;
export declare function getWellKnownUriResponse(smartStrategy: SmartStrategy): import("lodash").Dictionary<string | string[] | import("fhir-works-on-aws-interface").tokenEndpointAuthMethod[] | undefined>;
