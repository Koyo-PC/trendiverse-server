const Twitter = require('./TwitterAPI.js');
const addTrendsToDB = require('./addTrendsToDB.js');
const addPopularToDB = require('./addPopularToDB.js');
const track = require('./track.js');

/**
 * trend -> DB
 * @returns {array} trends
 */
module.exports = async function getTrend(){
    const trends = await Twitter.getTrend();
    if(trends.length == 0) return [];
    await addTrendsToDB(trends);
    await addPopularToDB(trends);
    await track(trends);
    return trends;
}