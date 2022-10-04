const Twitter = require('./TwitterAPI.js');
const addTrendsToDB = require('./addTrendsToDB.js');
const track = require('./track.js');

/**
 * trend -> DB
 */
module.exports = async function getTrend(){
    const trends = await Twitter.getTrend();
    await addTrendsToDB(trends);
    await track(trends);
    return trends;
}