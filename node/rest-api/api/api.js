import {onListRequest} from "./list.js";
import {onDataRequest} from "./data.js";
import {onInfoRequest} from "./info.js";

export class TrendiverseAPI {
    static onListRequest = onListRequest;
    static onDataRequest = onDataRequest;
    static onInfoRequest = onInfoRequest;
}