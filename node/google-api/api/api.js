const getDailyTrends = require("./getDailyTrends.js");
const getInterestOverTime = require("./getInterestOverTime.js");
const getList = require("./getList.js");
const addToDB = require("./addToDB.js");
const getIdByName = require("./getIdByName.js");
const getNameById = require("./getNameById.js");
const getAIDataById = require("./getAIDataById.js");
const getAIDataByName = require("./getAIDataByName.js");
const addNamesToDB = require("./addNamesToDB.js");

module.exports =  class GoogleAPI {
    static getDailyTrends = getDailyTrends;
    static getInterestOverTime = getInterestOverTime;
    static getList = getList;
    static addToDB = addToDB;
    static getIdByName = getIdByName;
    static getNameById = getNameById;
    static getAIDataById = getAIDataById;
    static getAIDataByName = getAIDataByName;
    static addNamesToDB = addNamesToDB;
}