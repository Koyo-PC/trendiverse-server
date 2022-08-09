const DB = require("../../rest-api/db/TrendiverseDB.js");

/**
 * table_id -> data
 * @param {int} id trend id
 * @returns {array} data (If the table is not found, [] will be returned.)
 */
module.exports = async function getDataById(id){
    const data = await DB.queryp(`select * from twitter_trend${id}`,true);
    if(data == undefined) return [];
    return data;
}