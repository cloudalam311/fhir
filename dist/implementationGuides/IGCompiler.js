import { existsSync, readdir, readFile, writeFile, realpathSync, statSync } from 'fs';
import util from 'util';
import path from 'path';
/* eslint no-restricted-syntax: 0 */
/* eslint no-await-in-loop: 0 */
/* eslint class-methods-use-this: 0 */
const readFilePmd = util.promisify(readFile);
const readDirPmd = util.promisify(readdir);
const writeFilePmd = util.promisify(writeFile);
const BASE_FHIR_NAME = 'hl7.fhir.r4.core';
export async function loadJson(fileName) {
    return JSON.parse(await readFilePmd(fileName, 'utf8'));
}
export async function storeJson(fileName, data) {
    await writeFilePmd(fileName, JSON.stringify(data));
}
async function listIgDirs(parentDir) {
    return (await readDirPmd(parentDir, { withFileTypes: true }))
        .filter((dirent) => {
        return (dirent.isDirectory() ||
            (dirent.isSymbolicLink() &&
                statSync(realpathSync(path.join(parentDir.toString(), dirent.name))).isDirectory()));
    })
        .map((dirent) => {
        return path.join(parentDir.toString(), dirent.name);
    });
}
/**
 *  Helper class used for compiling Implementation Guides packages
 */
export class IGCompiler {
    constructor(searchImplementationGuides, routingImplementationGuides, options) {
        this.searchImplementationGuides = searchImplementationGuides;
        this.routingImplementationGuides = routingImplementationGuides;
        this.options = options;
    }
    async collectResources(igDir, resourceTypes) {
        const indexJson = path.join(igDir.toString(), '.index.json');
        if (!existsSync(indexJson)) {
            throw new Error(`'.index.json' not found in ${igDir}`);
        }
        const index = await loadJson(indexJson);
        const resources = [];
        for (const file of index.files) {
            if (resourceTypes.includes(file.resourceType)) {
                const filePath = path.join(igDir.toString(), file.filename);
                console.log(`Compiling ${filePath}`);
                resources.push(await loadJson(filePath));
            }
        }
        return resources;
    }
    /**
     * Compiles the implementation guides packages located at `igsDir` and saves the results in `outputPath`
     *
     * This method delegates the compilation of specific resource types to the implementations of `ImplementationGuides.compile` from other fhir-works-on-aws modules.
     * @param igsDir
     * @param outputPath
     */
    async compileIGs(igsDir, outputPath) {
        if (!existsSync(igsDir)) {
            throw new Error(`'${igsDir}' doesn't exist`);
        }
        const igInfos = await this.collectIGInfos(igsDir);
        this.validateDependencies(igInfos);
        const searchParams = [];
        const routingFhirDefinitions = [];
        for (const igInfo of igInfos) {
            searchParams.push(...(await this.collectResources(igInfo.path, ['SearchParameter'])));
            routingFhirDefinitions.push(...(await this.collectResources(igInfo.path, ['StructureDefinition', 'OperationDefinition'])));
        }
        const compiledSearchParams = await this.searchImplementationGuides.compile(searchParams);
        const compiledRoutingDefinitions = await this.routingImplementationGuides.compile(routingFhirDefinitions);
        await storeJson(path.join(outputPath.toString(), 'fhir-works-on-aws-search-es.json'), compiledSearchParams);
        await storeJson(path.join(outputPath.toString(), 'fhir-works-on-aws-routing.json'), compiledRoutingDefinitions);
    }
    createIGKey(name, version) {
        if (this.options.ignoreVersion) {
            return name;
        }
        return `${name}@${version}`;
    }
    async extractIgInfo(igDir) {
        const packagePath = path.join(igDir.toString(), 'package.json');
        if (!existsSync(packagePath)) {
            throw new Error(`'package.json' not found in ${igDir}`);
        }
        console.log(`checking ${packagePath}`);
        const packageJson = await loadJson(packagePath);
        const dependencies = [];
        const igInfo = {
            id: this.createIGKey(packageJson.name, packageJson.version),
            url: packageJson.url,
            name: packageJson.name,
            version: packageJson.version,
            path: igDir.toString(),
            dependencies,
        };
        const packageDeps = packageJson.dependencies;
        if (packageDeps) {
            for (const [name, version] of Object.entries(packageDeps)) {
                const igId = this.createIGKey(name, version);
                dependencies.push(igId);
            }
        }
        return igInfo;
    }
    async collectIGInfos(igsDir) {
        const igInfos = [];
        for (const igPath of await listIgDirs(igsDir)) {
            console.log(`looking at ig path: ${igPath}`);
            const igInfo = await this.extractIgInfo(igPath);
            if (igInfo.name === BASE_FHIR_NAME) {
                console.log(`Skipping ${BASE_FHIR_NAME} since the base FHIR definitions are already included in fhir-works-on-aws`);
            }
            else {
                igInfos.push(igInfo);
            }
        }
        return igInfos;
    }
    validateDependencies(igInfos) {
        const parentMap = {};
        for (const igInfo of igInfos) {
            parentMap[igInfo.id] = igInfo.dependencies;
        }
        for (const igId of Object.keys(parentMap)) {
            this.depthFirst([igId], parentMap);
        }
    }
    depthFirst(parents, pMap) {
        const igId = parents[parents.length - 1];
        const dependencies = pMap[igId];
        if (!dependencies) {
            throw new Error(`Missing dependency ${igId}`);
        }
        for (const parentId of dependencies) {
            if (parents.includes(parentId)) {
                throw new Error(`Circular dependency found: ${parents.join(' -> ')} -> ${parentId}`);
            }
            if (!parentId.startsWith(BASE_FHIR_NAME)) {
                parents.push(parentId);
                this.depthFirst(parents, pMap);
                parents.pop();
            }
        }
    }
}
//# sourceMappingURL=IGCompiler.js.map