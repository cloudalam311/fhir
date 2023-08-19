import { Search } from './search';
import { History } from './history';
import { Authorization } from './authorization';
import { Persistence } from './persistence';
import { Bundle } from './bundle';
import { BulkDataAccess } from './bulkDataAccess';
export declare module stubs {
    const bundle: Bundle;
    const search: Search;
    const history: History;
    const passThroughAuthz: Authorization;
    const persistence: Persistence;
    const bulkDataAccess: BulkDataAccess;
}
