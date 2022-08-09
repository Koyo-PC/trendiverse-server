const Twitter = require('./TwitterAPI.js');
const addToDB = require('./addToDB.js');
const utf = require('../../rest-api/db/utf.js');

module.exports = async function onListRequest(){
    const trends = await Twitter.get_trend();
    await addToDB(trends);
    return trends;
}