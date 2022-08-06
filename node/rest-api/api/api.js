const onListRequest = require("./list.js");
const onInfoRequest = require("./info.js");

module.exports =  class TrendiverseAPI {
    static onListRequest = onListRequest;
    static onInfoRequest = onInfoRequest;
}