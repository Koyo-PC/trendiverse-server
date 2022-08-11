const Twitter = require('./TwitterAPI.js');
const addToDB = require('./addToDB.js');

/**
 * trend -> DB
 */
module.exports = async function getTrend(){
    const trends = await Twitter.getTrend();
    await addToDB(trends);
    return trends;
}