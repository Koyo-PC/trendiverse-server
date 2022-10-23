const Twitter = require('./TwitterAPI.js');
const DB = require("../../rest-api/db/TrendiverseDB.js");
const getNameById = require('./getNameById.js');
const getIdByName = require('./getIdByName.js');

/**
 * track listに入っているもののうちtrend配列に含まれていないものを80trendsまで追加記録
 * 全区間での相対値が0.3未満になればtrackedに入る
 * 
 * trend入ってるか確認->データ追加(->twitter_trackingからtwitter_trackedに移動)->twitter_trakingの空き確認->80まで新規追加
 * 
 * @param {Array} trend from getTrend()
 */

module.exports = async function track(trend){
    try {
        //リスト確認
        const tracking_obj = await DB.queryp(`select * from twitter_tracking`, true);
        const tracking_ids = [];
        let tracking_num = tracking_obj.length;

        //データ追加(トレンドにないもののみ) & 0.3未満は削除して終了リストに追加
        for(tracking of tracking_obj){
            const id = tracking["id"];
            const name = await getNameById(id);
            tracking_ids.push(id);

            let flag1 = false;
            //トレンドにあるか探す
            for(trend_data of trend){
                if(trend_data["name"] == name){
                    flag1 = true;
                    break;
                }
            }
            if(flag1) continue;

            const count = await Twitter.count(name);
            const max_obj = await DB.queryp(`select max(hotness) from twitter_trend${id}`);
            const max = max_obj["max(hotness)"];

            //total追加
            await DB.queryp(`insert into twitter_trend${id} (hotness) values(${count["total"]})`);

            //大昔のトレンドのためにテーブル確認
            let flag2;
            try {
                await DB.queryp(`select 1 from twitter_trend_delta${id}`);
                flag2 = false;
            } catch (e){
                flag2 = true;
            }
            //tableない場合
            if(flag2) {
                await DB.queryp(`create table twitter_trend_delta${id} (date timestamp default current_timestamp, hotness float)`);
            }

            //delta追加
            await DB.queryp(`insert into twitter_trend_delta${id} (hotness) values(${count["delta"]})`);

            if(count["total"] < 0.3 * max){
                await DB.queryp(`delete from twitter_tracking where id=${id}`);
                await DB.queryp(`insert into twitter_tracked (id) values(${id})`);
            }
        }

        for(trend_data of trend){
            const id = await getIdByName(trend_data["name"]);
            if(tracking_ids.includes(id)) continue;
            else if(tracking_num < 250){
                tracking_num++;
                await DB.queryp(`delete from twitter_tracked where id=${id}`); //周期的なもの対策
                await DB.queryp(`insert into twitter_tracking (id) values(${id})`);
            } else {
                break;
            }
        }

    } catch(e){
        console.log(e);
    };
}
