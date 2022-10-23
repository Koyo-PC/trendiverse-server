const DB = require("../../rest-api/db/TrendiverseDB.js");

/**
 * table_id -> name
 * @param {int} id trend id
 * @returns {string} name (If the id is not found, "" will be returned.)
 */
module.exports = async function getNameById(id){
    if(id == null) return "";
    let data;
    try {
        data = await DB.queryp(`select name from twitter_list where id=${id}`);
    } catch {
        return "";
    }
    if(data == undefined) return "";
    return DB.to_STRING(data["name"]);
}