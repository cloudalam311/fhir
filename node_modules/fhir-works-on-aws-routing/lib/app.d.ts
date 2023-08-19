import { Express } from 'express';
import { CorsOptions } from 'cors';
import { FhirConfig } from 'fhir-works-on-aws-interface';
export declare function generateServerlessRouter(fhirConfig: FhirConfig, supportedGenericResources: string[], corsOptions?: CorsOptions): Express;
