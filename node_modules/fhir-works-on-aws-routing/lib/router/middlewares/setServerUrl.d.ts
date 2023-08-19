import { FhirConfig } from 'fhir-works-on-aws-interface';
import express from 'express';
/**
 * Sets the value of `res.locals.serverUrl`
 * the serverUrl can either be a static value from FhirConfig of a dynamic value for some multi-tenancy setups.
 */
export declare const setServerUrlMiddleware: (fhirConfig: FhirConfig) => (req: express.Request, res: express.Response, next: express.NextFunction) => void;
