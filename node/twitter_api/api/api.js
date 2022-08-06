const onListRequest = require("./list.js");
// const onInfoRequest = require("./info.js");

module.exports =  class TwitterAPI {
    static onListRequest = onListRequest;
    // static onInfoRequest = onInfoRequest;
}