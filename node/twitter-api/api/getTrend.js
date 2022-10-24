const Twitter = require('./TwitterAPI.js');
const addTrendsToDB = require('./addTrendsToDB.js');
const addPopularToDB = require('./addPopularToDB.js');
const track = require('./track.js');

/**
 * trend -> DB
 * @param {int} token_type token type 
 * @returns {array} trends
 */
module.exports = async function getTrend(token_type){
    console.log("called");
    const trends = await Twitter.getTrend(token_type);
    if(trends.length == 0) return [];
    await addTrendsToDB(trends);
    await addPopularToDB(token_type,trends);
    await track(token_type,trends);
    return trends;
}