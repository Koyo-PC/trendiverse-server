const DB = require("../../rest-api/db/TrendiverseDB.js");
/**
 * table_id -> delta
 * @param {int} id trend id
 * @returns {array} popular tweets(id) (If the table is not found, [] will be returned.)
 */
module.exports = async function getPopularDataById(id){
    let data;
    if(id == -1 || id == null) return [];
    
    try{
        data = await DB.queryp(`select * from twitter_trend_popular${id}`);
    } catch{
        return [];
    }
    if(data == undefined) return [];

    if(data["ids"] == "") return [];
    const ret = data["ids"].split(",");
    for(let i=0; i<ret.length; i++){
        ret[i] = ret[i];
    }
    return ret;
}
