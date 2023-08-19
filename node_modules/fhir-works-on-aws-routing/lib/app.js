"use strict";
/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateServerlessRouter = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fhir_works_on_aws_interface_1 = require("fhir-works-on-aws-interface");
const genericResourceRoute_1 = __importDefault(require("./router/routes/genericResourceRoute"));
const configHandler_1 = __importDefault(require("./configHandler"));
const metadataRoute_1 = __importDefault(require("./router/routes/metadataRoute"));
const resourceHandler_1 = __importDefault(require("./router/handlers/resourceHandler"));
const rootRoute_1 = __importDefault(require("./router/routes/rootRoute"));
const errorHandling_1 = require("./router/routes/errorHandling");
const exportRoute_1 = __importDefault(require("./router/routes/exportRoute"));
const wellKnownUriRoute_1 = __importDefault(require("./router/routes/wellKnownUriRoute"));
const registry_1 = require("./registry");
const operationDefinitions_1 = require("./operationDefinitions");
const setServerUrl_1 = require("./router/middlewares/setServerUrl");
const setTenantId_1 = require("./router/middlewares/setTenantId");
const setContentType_1 = require("./router/middlewares/setContentType");
const configVersionSupported = 1;
function prepareRequestContext(req) {
    const requestContext = {
        headers: req.headers,
        hostname: req.hostname,
        url: req.url,
        contextInfo: {},
    };
    if (req.method) {
        const method = req.method.toUpperCase();
        if (['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE'].includes(method)) {
            requestContext.verb = method;
        }
    }
    return requestContext;
}
function generateServerlessRouter(fhirConfig, supportedGenericResources, corsOptions) {
    var _a, _b, _c;
    if (configVersionSupported !== fhirConfig.configVersion) {
        throw new Error(`This router does not support ${fhirConfig.configVersion} version`);
    }
    const configHandler = new configHandler_1.default(fhirConfig, supportedGenericResources);
    const { fhirVersion, genericResource, compiledImplementationGuides } = fhirConfig.profile;
    const serverUrl = fhirConfig.server.url;
    let hasCORSEnabled = false;
    const registry = new registry_1.FHIRStructureDefinitionRegistry(compiledImplementationGuides);
    const operationRegistry = (0, operationDefinitions_1.initializeOperationRegistry)(configHandler);
    const app = (0, express_1.default)();
    app.disable('x-powered-by');
    const mainRouter = express_1.default.Router({ mergeParams: true });
    mainRouter.use(express_1.default.urlencoded({ extended: true }));
    mainRouter.use(express_1.default.json({
        type: ['application/json', 'application/fhir+json', 'application/json-patch+json'],
        // 6MB is the maximum payload that Lambda accepts
        limit: '6mb',
    }));
    // Add cors handler before auth to allow pre-flight requests without auth.
    if (corsOptions) {
        mainRouter.use((0, cors_1.default)(corsOptions));
        hasCORSEnabled = true;
    }
    mainRouter.use((0, setServerUrl_1.setServerUrlMiddleware)(fhirConfig));
    mainRouter.use(setContentType_1.setContentTypeMiddleware);
    // Metadata
    const metadataRoute = new metadataRoute_1.default(fhirVersion, configHandler, registry, operationRegistry, hasCORSEnabled);
    mainRouter.use('/metadata', metadataRoute.router);
    if (fhirConfig.auth.strategy.service === 'SMART-on-FHIR') {
        // well-known URI http://www.hl7.org/fhir/smart-app-launch/conformance/index.html#using-well-known
        const smartStrat = fhirConfig.auth.strategy.oauthPolicy;
        if (smartStrat.capabilities) {
            const wellKnownUriRoute = new wellKnownUriRoute_1.default(smartStrat);
            mainRouter.use('/.well-known/smart-configuration', wellKnownUriRoute.router);
        }
    }
    // AuthZ
    mainRouter.use(async (req, res, next) => {
        var _a, _b;
        try {
            const requestInformation = (_b = (_a = operationRegistry.getOperation(req.method, req.path)) === null || _a === void 0 ? void 0 : _a.requestInformation) !== null && _b !== void 0 ? _b : (0, fhir_works_on_aws_interface_1.getRequestInformation)(req.method, req.path);
            // Clean auth header (remove 'Bearer ')
            req.headers.authorization = (0, fhir_works_on_aws_interface_1.cleanAuthHeader)(req.headers.authorization);
            res.locals.requestContext = prepareRequestContext(req);
            res.locals.userIdentity = await fhirConfig.auth.authorization.verifyAccessToken({
                ...requestInformation,
                requestContext: res.locals.requestContext,
                accessToken: req.headers.authorization,
                fhirServiceBaseUrl: res.locals.serverUrl,
            });
            next();
        }
        catch (e) {
            next(e);
        }
    });
    if ((_a = fhirConfig.multiTenancyConfig) === null || _a === void 0 ? void 0 : _a.enableMultiTenancy) {
        mainRouter.use((0, setTenantId_1.setTenantIdMiddleware)(fhirConfig));
    }
    // Export
    if (fhirConfig.profile.bulkDataAccess) {
        const exportRoute = new exportRoute_1.default(fhirConfig.profile.bulkDataAccess, fhirConfig.auth.authorization, fhirConfig.profile.fhirVersion);
        mainRouter.use('/', exportRoute.router);
    }
    // Operations defined by OperationDefinition resources
    operationRegistry.getAllRouters().forEach((router) => {
        mainRouter.use('/', router);
    });
    // Special Resources
    if (fhirConfig.profile.resources) {
        Object.entries(fhirConfig.profile.resources).forEach(async (resourceEntry) => {
            const { operations, persistence, typeSearch, typeHistory, fhirVersions } = resourceEntry[1];
            if (fhirVersions.includes(fhirVersion)) {
                const resourceHandler = new resourceHandler_1.default(persistence, typeSearch, typeHistory, fhirConfig.auth.authorization, serverUrl, fhirConfig.validators);
                const route = new genericResourceRoute_1.default(operations, resourceHandler, fhirConfig.auth.authorization);
                mainRouter.use(`/:resourceType(${resourceEntry[0]})`, route.router);
            }
        });
    }
    // Generic Resource Support
    // Make a list of resources to make
    const genericFhirResources = configHandler.getGenericResources(fhirVersion);
    if (genericResource && genericResource.fhirVersions.includes(fhirVersion)) {
        const genericOperations = configHandler.getGenericOperations(fhirVersion);
        const genericResourceHandler = new resourceHandler_1.default(genericResource.persistence, genericResource.typeSearch, genericResource.typeHistory, fhirConfig.auth.authorization, serverUrl, fhirConfig.validators);
        const genericRoute = new genericResourceRoute_1.default(genericOperations, genericResourceHandler, fhirConfig.auth.authorization);
        // Set up Resource for each generic resource
        genericFhirResources.forEach(async (resourceType) => {
            mainRouter.use(`/:resourceType(${resourceType})`, genericRoute.router);
        });
    }
    // Root Post (Bundle/Global Search)
    if (fhirConfig.profile.systemOperations.length > 0) {
        const rootRoute = new rootRoute_1.default(fhirConfig.profile.systemOperations, fhirConfig.validators, serverUrl, fhirConfig.profile.bundle, fhirConfig.profile.systemSearch, fhirConfig.profile.systemHistory, fhirConfig.auth.authorization, genericFhirResources, genericResource, fhirConfig.profile.resources);
        mainRouter.use('/', rootRoute.router);
    }
    mainRouter.use(errorHandling_1.applicationErrorMapper);
    mainRouter.use(errorHandling_1.httpErrorHandler);
    mainRouter.use(errorHandling_1.unknownErrorHandler);
    if (((_b = fhirConfig.multiTenancyConfig) === null || _b === void 0 ? void 0 : _b.enableMultiTenancy) && ((_c = fhirConfig.multiTenancyConfig) === null || _c === void 0 ? void 0 : _c.useTenantSpecificUrl)) {
        app.use('/tenant/:tenantIdFromPath([a-zA-Z0-9\\-_]{1,64})', mainRouter);
    }
    else {
        app.use('/', mainRouter);
    }
    return app;
}
exports.generateServerlessRouter = generateServerlessRouter;
//# sourceMappingURL=app.js.map