const DB = require("../../rest-api/db/TrendiverseDB.js");

/**
 * name -> name(UTF16) -> table_id
 * @param {string} name trend name
 * @returns {int} table id or -1 (error)
 */
module.exports = async function getIdByName(name){
    const utf = DB.to_UTF16(name);
    const res = await DB.queryp(`select id from twitter_list where name="${utf}"`);
    if(res == undefined) return -1;
    return res.id;
}