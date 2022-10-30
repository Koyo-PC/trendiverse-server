const DB = require("../../rest-api/db/TrendiverseDB.js");
const getNameById = require('./getNameById.js');
const trendScrape = require('./trendScrape.js');

/**
 * @param {string} date ex. 2022-10-29
 * @returns {Array} ids
 */
module.exports = async function showTracked(date){
    if(date == null){ //最新のトレンド(DBから)
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
    } else { //日付指定
        return await trendScrape(date);
    }
}