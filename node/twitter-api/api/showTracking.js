const DB = require("../../rest-api/db/TrendiverseDB.js");
const DockerUtil = require("../../rest-api/dockerUtil.js");

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

    //テスト
    console.log(await DockerUtil.getSecret("TWITTER_BEARER_TOKEN2") == "");
    const min = new Date().getMinutes();
    let type = 0;
    if((0 <= min && min < 10) || (20 <= min && min < 30) || (40 <= min && min < 50)) type = 1;
    else type = 2;
    console.log(type);
    return data;
}