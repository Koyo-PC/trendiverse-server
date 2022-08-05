import DB from "../db/TrendiverseDB.js";

/**
 * This function involves two tables: google_list and twitter_list.
 * You can create them by executing the commands below.
 * 
 * create table google_list (name varchar(32));
 * create table twitter_list (name varchar(32));
 * 
 * @returns {string}
 */

export function onListRequest() {   

    const google_list = DB.queryp("select name from google_list", true);
    const twitter_list = DB.queryp("select name from twitter_list", true);

    const retobj = {
        "google": google_list,
        "twitter": twitter_list
    }

    return JSON.stringify(retobj);
}