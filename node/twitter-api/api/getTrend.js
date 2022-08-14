const Twitter = require('./TwitterAPI.js');
const addTrendsToDB = require('./addTrendsToDB.js');

/**
 * trend -> DB
 */
module.exports = async function getTrend(){
    const trends = await Twitter.getTrend();
    await addTrendsToDB(trends);
    return trends;
}