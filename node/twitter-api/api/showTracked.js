const DB = require("../../rest-api/db/TrendiverseDB.js");

/**
 * @returns {Array} ids
 */
module.exports = async function showTracked(){
    let data;
    try {
        data = await DB.queryp(`select * from twitter_tracked`,true);
    } catch {
        return "";
    }

    return data;
}