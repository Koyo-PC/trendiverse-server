const DB = require("../db/TrendiverseDB.js");

/**
 * This function involves two tables: google_list and twitter_list.
 * You can create them by executing the commands below.
 * 
 * create table google_list (name varchar(32));
 * create table twitter_list (name varchar(32));
 * 
 * @returns {Promise} You will get {string} when the promise is solved by using "await onListRequest();"
 */

module.exports = async function onListRequest(){  
    let google_list,twitter_list; 
    try{
        google_list = await DB.queryp("select name from google_list", true);
        twitter_list = await DB.queryp("select name from twitter_list", true);
    } catch (e){
        console.log(e);
    }

    const retobj = {
        "google": google_list,
        "twitter": twitter_list,
        "test": 1
    }

    return JSON.stringify(retobj);
}