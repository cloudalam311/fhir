import { FhirConfig } from 'fhir-works-on-aws-interface';
import express from 'express';
/**
 * Sets the value of `res.locals.tenantId`
 * tenantId is used to identify tenants in a multi-tenant setup
 */
export declare const setTenantIdMiddleware: (fhirConfig: FhirConfig) => (req: express.Request, res: express.Response, next: express.NextFunction) => void;
