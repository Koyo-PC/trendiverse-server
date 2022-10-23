const DB = require("../../rest-api/db/TrendiverseDB.js");
const getPopularTweetsByName = require('./getPopularTweetsByName.js');
const getIdByName = require('./getIdByName.js');

/**
 * add popular tweets(id) into your twitter DB
 * If you do not have an appropriate table, it will be created first.
 * @param {array} arr array of trends
 * @param {id} trend_id id of the trend
 */
module.exports = async function addPopularToDB(arr){
    let promises = [];
    for (trend of arr){
        const name = trend["name"];
        promises.push(new Promise(async (resolve,reject) => {
            try {
                const tweets = await getPopularTweetsByName(name);
                let id_string = "";
                for (tweet of tweets){
                    id_string += tweet["id"]+",";
                }
                id_string = id_string.slice(0,-1);
                const trend_id = await getIdByName(name);

                //存在確認----------------------------------------------------------------------------
                let flag;
                try {
                    await DB.queryp(`select 1 from twitter_trend_popular${trend_id}`);
                    flag = false;
                } catch (e){
                    flag = true;
                }
    
                if(flag) {
                    //tableない場合 -> 作成
                    await DB.queryp(`create table twitter_trend_popular${trend_id} (ids varchar(256))`);
                } else {
                    //tableある場合 -> 削除
                    await DB.queryp(`delete from twitter_trend_popular${trend_id}`);
                }
                //リストに記録(更新)
                await DB.queryp(`insert into twitter_trend_popular${trend_id} (ids) values("${id_string}")`);

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
            console.log(e)}
        );
}