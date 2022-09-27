const DB = require("../../rest-api/db/TrendiverseDB.js");
const getNameById = require('./getNameById.js');

/**
 * @returns {Array} ids
 */
module.exports = async function showTracked(){
    let data;
    try {
        data = await DB.queryp(`select * from twitter_current_trends`,true);
        for (const trend of data){
            const name = await getNameById(trend["id"]);
            trend["name"] = name;
        }
    } catch {
        return "";
    }

    return data;
}