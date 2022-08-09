const DB = require("../../rest-api/db/TrendiverseDB.js");

/**
 * table_id -> name
 * @param {int} id trend id
 * @returns {string} name (If the id is not found, undefined will be returned.)
 */
module.exports = async function getNameById(id){
    const data = await DB.queryp(`select name from twitter_list where id=${id}`);
    if(data == undefined) return undefined;
    return DB.to_STRING(data["name"]);
}