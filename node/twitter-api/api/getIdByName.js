const DB = require("../../rest-api/db/TrendiverseDB.js");

/**
 * name -> name(UTF16) -> table_id
 * @param {string} name trend name
 * @returns {int} table id or -1 (error)
 */
module.exports = async function getIdByName(name){
    let res;
    try{
        const utf = DB.to_UTF16(name);
        res = await DB.queryp(`select id from twitter_list where name="${utf}"`);
    } catch {
        return -1;
    }
    if(res == undefined) return -1;
    return res.id;
}