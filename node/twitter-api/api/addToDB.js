const DB = require("../../rest-api/db/TrendiverseDB.js");

/**
 * put data into your DB
 * If you do not have an appropriate table, it will be created first.
 * @param {array} arr array of trends
 */
module.exports = async function addToDB(arr){
    const promises = [];
    for (trend of arr){
        const {name, tweet_volume} = trend;
        promises.push(new Promise(async (resolve,reject) => {
            try {
                const res = await DB.queryp(`select id from twitter_list where name="${DB.to_UTF16(name)}"`);
                let trend_id;
                if(res == undefined){ 
                    //create a new table
                    await DB.queryp(`insert into twitter_list (name) values("${DB.to_UTF16(name)}")`);
                    const num = await DB.queryp(`select id from twitter_list where name="${DB.to_UTF16(name)}"`);
                    trend_id = num.id;
                    await DB.queryp(`create table twitter_trend${trend_id} (date timestamp default current_timestamp, hotness float)`);
                } else {
                    trend_id = res.id;
                }
                await DB.queryp(`insert into twitter_trend${trend_id} (hotness) values(${tweet_volume})`);
                resolve();
            } catch(e){
                console.log(e);
                reject(e);
            };
        }));
    };
    
    await Promise.all(promises)
            .catch((e)=>{
                console.log(e)}
            );
}