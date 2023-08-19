import { Router } from 'express';
import { SmartStrategy } from 'fhir-works-on-aws-interface';
export default class WellKnownUriRouteRoute {
    readonly router: Router;
    readonly smartStrategy: SmartStrategy;
    constructor(smartStrategy: SmartStrategy);
    private init;
}
