import express from 'express';
/**
 * Set default content-type to 'application/fhir+json'
 */
export declare const setContentTypeMiddleware: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
