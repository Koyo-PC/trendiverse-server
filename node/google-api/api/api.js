const getDailyTrends = require("./getDailyTrends.js");
const getInterestOverTime = require("./getInterestOverTime.js");

module.exports =  class GoogleAPI {
    static getDailyTrends = getDailyTrends;
    static getInterestOverTime = getInterestOverTime;
}