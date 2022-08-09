const getTrend = require("./getTrend.js");
const getDataByName = require("./getDataByName.js");
const getIdByName = require("./getIdByName.js");
const getDataById = require("./getDataById.js");
const getNameById = require("./getNameById.js");
const getList = require("./getList.js");

module.exports =  class TwitterAPI {
    static getTrend = getTrend; //for cron
    static getIdByName = getIdByName;
    static getDataByName = getDataByName;
    static getDataById = getDataById;
    static getNameById = getNameById;
    static getList = getList;
}