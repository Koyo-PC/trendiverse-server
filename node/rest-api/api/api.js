const getList = require("./getList.js");
const getDataByName = require("./getDataByName.js");

module.exports =  class TrendiverseAPI {
    static getList = getList;
    static getDataByName = getDataByName;
}