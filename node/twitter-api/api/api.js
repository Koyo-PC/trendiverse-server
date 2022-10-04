const getTrend = require("./getTrend.js");
const getDataByName = require("./getDataByName.js");
const getIdByName = require("./getIdByName.js");
const getDataById = require("./getDataById.js");
const getNameById = require("./getNameById.js");
const getList = require("./getList.js");
const addToDB = require("./addToDB.js");
const showTracked = require("./showTracked.js");
const showTrend = require("./showTrend.js");

const getAIDataById = require("./getAIDataById.js");
const getAIDataByName = require("./getAIDataByName.js");

module.exports =  class TwitterAPI {
    static getTrend = getTrend; //for cron
    static getIdByName = getIdByName;
    static getDataByName = getDataByName;
    static getDataById = getDataById;
    static getNameById = getNameById;
    static getList = getList;
    static addToDB = addToDB;
    static showTracked = showTracked;
    static showTrend = showTrend;

    static getAIDataById = getAIDataById;
    static getAIDataByName = getAIDataByName;
}