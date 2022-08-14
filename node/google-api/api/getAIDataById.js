const DB = require("../../rest-api/db/TrendiverseDB.js");

/**
 * table_id -> data
 * @param {int} id trend id
 * @param {string} since yyyy-MM-dd-HH-mm-ss (optional)
 * @returns {array} data (If the table is not found, [] will be returned.)
 */
module.exports = async function getDataById(id,since){
    let data;
    if(id == -1) return [];
    
    try{
        if(since == "") data = await DB.queryp(`select * from google_trend${id}_ai`,true);
        else data = await DB.queryp(`select * from google_trend${id}_ai where date > "${since}"`,true);
    } catch{
        return [];
    }
    if(data == undefined) return [];
    return data;
}