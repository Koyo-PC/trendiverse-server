const DB = require("../../rest-api/db/TrendiverseDB.js");

/**
 * put data into your DB
 * If you do not have an appropriate table, it will be created first.
 * @param {int} id table id
 * @param {array} arr array of trends
 * like
 * [
 *  {...},
 *  {...}
 * ]
 */
module.exports = async function addTrendsToDB(id,arr){
    if(id == -1) return -1;

    let flag;
    try {
        await DB.queryp(`select 1 from google_trend${id}_ai`);
        flag = false;
    } catch {
        flag = true;
    }

    try{
        if(flag) await DB.queryp(`create table google_trend${id}_ai (date timestamp default 0, hotness float)`);
        for(data of arr){
            const date = data["date"];
            const hotness = data["hotness"];
            let new_date = date.replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})-([0-9]{2})-([0-9]{2})-([0-9]{2})/,(match,y,mo,d,h,mi,s)=>{
                return `${y}-${mo}-${d} ${h}:${mi}:${s}`;
            });
            await DB.queryp(`insert into google_trend${id}_ai (date,hotness) values("${new_date}",${hotness})`);
        }
        return 0;
    } catch (e){
        return e;
    }
}