const DB = require("../db/TrendiverseDB.js");
const tableCheck = require("./tableCheck.js");

/**
 * This function involves a table named ${name}.
 * You can create such table by executing the command below.
 * 
 * create table google_trend1 (date timestamp default current_timestamp, hotness float);
 * @param {string} last_request 
 * yyyy-MM-dd-HH-mm-ss 
 * example: /info?name=Hoge&last_request=2022-01-01-00-00-00
 * @param {string} name trand name
 * @returns {Promise} You will get {string} when the promise is solved by using "await onListRequest();"
 */

module.exports = async function onInfoRequest(last_request, name) {
    let google_list=[],twitter_list=[]; 
    try{
        if(await tableCheck(`google_${name}`)){
            google_list = await DB.queryp(`select * from google_${name} where date > "${last_request}"`, true);
        }
        if(await tableCheck(`twitter_${name}`)){
            twitter_list = await DB.queryp(`select * from twitter_${name} where date > "${last_request}"`, true);
        }
    } catch (e){
        console.log(e);
    }

    const retobj = {
        "category": "",
        "related": "",
        "data": {
            "google": google_list,
            "twitter": twitter_list
        }
    } 
    return JSON.stringify(retobj);
}