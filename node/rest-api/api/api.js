import {onListRequest} from "./list.js";
import {onInfoRequest} from "./info.js";

export class TrendiverseAPI {
    static onListRequest = onListRequest;
    static onInfoRequest = onInfoRequest;
}