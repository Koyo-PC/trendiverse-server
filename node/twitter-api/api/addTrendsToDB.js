const DB = require("../../rest-api/db/TrendiverseDB.js");

/**
 * add data into your twitter DB
 * If you do not have an appropriate table, it will be created first.
 * @param {array} arr array of trends
 */
module.exports = async function addTrendsToDB(arr){
    try{
        //前回のトレンドリスト削除
        await DB.queryp(`delete from twitter_current_trends`);
    } catch {
        console.log("twitter_current_trends error");
    }

    let promises = [];
    for (trend of arr){
        const {name, tweet_volume} = trend;
        promises.push(new Promise(async (resolve,reject) => {
            try {
                //リスト確認
                const res = await DB.queryp(`select id from twitter_list where name="${DB.to_UTF16(name)}"`);

                let trend_id;
                if(res == undefined){ 
                    await DB.queryp(`insert into twitter_list (name) values("${DB.to_UTF16(name)}")`);
                    const num = await DB.queryp(`select id from twitter_list where name="${DB.to_UTF16(name)}"`);
                    trend_id = num.id;
                } else {
                    trend_id = res.id;
                }

                //今のトレンドに追加----------------------------------------------------------------
                await DB.queryp(`insert into twitter_current_trends (id, hotness) values(${trend_id}, ${tweet_volume["total"]})`);

                //存在確認 (total)----------------------------------------------------------------------------
                let flag1;
                try {
                    await DB.queryp(`select 1 from twitter_trend${trend_id}`);
                    flag1 = false;
                } catch (e){
                    flag1 = true;
                }
                //tableない場合
                if(flag1) {
                    await DB.queryp(`create table twitter_trend${trend_id} (date timestamp default current_timestamp, hotness float)`);
                }

                //リストに記録 (total)
                await DB.queryp(`insert into twitter_trend${trend_id} (hotness) values(${tweet_volume["total"]})`);

                //存在確認 (delta)-----------------------------------------------------------------------------
                let flag2;
                try {
                    await DB.queryp(`select 1 from twitter_trend_delta${trend_id}`);
                    flag2 = false;
                } catch (e){
                    flag2 = true;
                }
                //tableない場合
                if(flag2) {
                    await DB.queryp(`create table twitter_trend_delta${trend_id} (date timestamp default current_timestamp, hotness float)`);
                }

                //リストに記録
                await DB.queryp(`insert into twitter_trend_delta${trend_id} (hotness) values(${tweet_volume["delta"]})`);

                resolve();
            } catch(e){
                console.log(e);
                reject(e);
            };
        }));

        //コネクション不足のため
        if(promises.length == 10){
            await Promise.all(promises)
                .catch((e)=>{
                    console.log(e)}
                );
            promises = [];
        }
    };

    await Promise.all(promises)
        .catch((e)=>{
            console.log(e)
        });
}