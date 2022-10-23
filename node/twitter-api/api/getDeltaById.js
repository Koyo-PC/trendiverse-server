const DB = require("../../rest-api/db/TrendiverseDB.js");
/**
 * table_id -> delta
 * @param {int} id trend id
 * @param {string} since yyyy-MM-dd-HH-mm-ss (optional)
 * @returns {array} delta (If the table is not found, [] will be returned.)
 */
module.exports = async function getDeltaById(id,since){
    let data;
    if(id == -1) return [];
    
    try{
        if(since == "") data = await DB.queryp(`select * from twitter_trend_delta${id}`,true);
        else data = await DB.queryp(`select * from twitter_trend_delta${id} where date > "${since}"`,true);
    } catch{
        return [];
    }
    if(data == undefined) return [];
    return data;
}
