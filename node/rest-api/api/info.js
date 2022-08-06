const DB = require("../db/TrendiverseDB.js");

/**
 * 
 * @param {Date} time 
 * @returns {string} yyyy-mm-dd-hh-mm-ss
 */

function get_date_string(time=new Date()){
    const [year,month,date,hour,minute,second] =
      [time.getFullYear(),time.getMonth()+1,time.getDate(),time.getHours(),time.getMinutes(),time.getSeconds()];
    return year+"-"+String(month).padStart(2, '0')+"-"+String(date).padStart(2, '0')+"-"+String(hour).padStart(2, '0')+"-"+String(minute).padStart(2, '0')+"-"+String(second).padStart(2, '0');
}

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
        if(await DB.tableCheck(`google_${name}`)){
            google_list = await DB.queryp(`select * from google_${name} where date > "${last_request}"`, true);
            console.log(google_list);
            for(let i=0; i<google_list.length; i++){
                google_list[i].date = get_date_string(new Date(google_list[i].date));
            }
        }
        if(await DB.tableCheck(`twitter_${name}`)){
            twitter_list = await DB.queryp(`select * from twitter_${name} where date > "${last_request}"`, true);
            for(let i=0; i<twitter_list.length; i++){
                twitter_list[i].date = get_date_string(new Date(twitter_list[i].date));
            }
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