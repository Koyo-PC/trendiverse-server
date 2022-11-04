const DB = require("../../rest-api/db/TrendiverseDB.js");

/**
 * table_id -> data
 * @param {int} id trend id
 * @param {string} since yyyy-MM-dd-HH-mm-ss (optional)
 * @returns {array} data (If the table is not found, [] will be returned.)
 */
module.exports = async function getDataById(id,since){
    let data;
    if(id == -1 || id == null) return [];
    
    try{
        if(since == "") data = await DB.queryp(`select * from twitter_trend${id}`,true);
        else data = await DB.queryp(`select * from twitter_trend${id} where date > "${since}" and hotness != 0`,true);
    } catch{
        return [];
    }
    if(data == undefined) return [];
    return data;
}
