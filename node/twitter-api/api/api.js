const getTrend = require("./getTrend.js");
const getDataByName = require("./getDataByName.js");
const getIdByName = require("./getIdByName.js");
const getDataById = require("./getDataById.js");
const getNameById = require("./getNameById.js");
const getList = require("./getList.js");
const addToDB = require("./addToDB.js");
const showTracked = require("./showTracked.js");
const showTrend = require("./showTrend.js");
const showTracking = require("./showTracking.js");
const getDeltaById = require("./getDeltaById.js");
const getDeltaByName = require("./getDeltaByName.js");
const getPopularTweetsByName = require("./getPopularTweetsByName.js");
const getPopularTweetsById = require("./getPopularTweetsById.js");
const getPopularDataById = require("./getPopularDataById.js");
const getPopularDataByName = require("./getPopularDataByName.js");
const getDividedDataById = require("./getDividedDataById.js");
const getDividedDataByName = require("./getDividedDataByName.js");

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
    static showTracking = showTracking;
    static getDeltaById = getDeltaById;
    static getDeltaByName = getDeltaByName;
    static getPopularTweetsByName = getPopularTweetsByName;
    static getPopularTweetsById = getPopularTweetsById;
    static getPopularDataById = getPopularDataById;
    static getPopularDataByName = getPopularDataByName;
    static getDividedDataById = getDividedDataById;
    static getDividedDataByName = getDividedDataByName;

    static getAIDataById = getAIDataById;
    static getAIDataByName = getAIDataByName;
}