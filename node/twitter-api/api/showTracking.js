const DB = require("../../rest-api/db/TrendiverseDB.js");
const getIdByName = require('./getIdByName.js');

/**
 * @returns {Array} ids
 */
module.exports = async function showTracking(){
    let data;
    try {
        data = await DB.queryp(`select id from twitter_tracking`,true);
    } catch {
        return "";
    }

    return data;
}