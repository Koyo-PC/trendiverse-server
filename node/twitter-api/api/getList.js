const DB = require("../../rest-api/db/TrendiverseDB.js");

/**
 * table list
 * @returns {array} id and name
 */
module.exports = async function getList(){
    const data = await DB.queryp(`select * from twitter_list`,true);
    for (trend of data){
        trend["name"] = DB.to_STRING(trend["name"]);
    }
    return data;
}