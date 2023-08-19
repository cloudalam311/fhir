import { Router } from 'express';
import { Authorization, Bundle, SystemOperation, Search, History, GenericResource, Resources, Validator } from 'fhir-works-on-aws-interface';
export default class RootRoute {
    readonly router: Router;
    private bundleHandler;
    private rootHandler;
    private authService;
    private operations;
    constructor(operations: SystemOperation[], validators: Validator[], serverUrl: string, bundle: Bundle, search: Search, history: History, authService: Authorization, supportedGenericResources: string[], genericResource?: GenericResource, resources?: Resources);
    init(): void;
}
