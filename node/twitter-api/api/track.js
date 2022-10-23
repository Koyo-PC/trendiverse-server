const Twitter = require('./TwitterAPI.js');
const DB = require("../../rest-api/db/TrendiverseDB.js");
const getNameById = require('./getNameById.js');

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
        const tracking = await DB.queryp(`select * from twitter_tracking`, true);
        const track_list = [];
        for(let i=0; i < tracking.length; i++){
            const name = await getNameById(tracking[i]["id"]);
            let flag = false;
            for(let j=0; j<trend.length; j++){
                if(trend[j]["name"] == name){
                    flag = true;
                    break;
                }
            }
            if(!flag){
                track_list.push({"id":tracking[i]["id"], "name":name});
            }
        }

        //データ追加 & 0.3未満は削除して終了リストに追加
        for(let i=0; i<track_list.length; i++){
            const count = await Twitter.count(track_list[i]["name"]);
            const max_obj = await DB.queryp(`select max(hotness) from twitter_trend${track_list[i]["id"]}`);
            const max = max_obj["max(hotness)"];

            //total追加
            await DB.queryp(`insert into twitter_trend${track_list[i]["id"]} (hotness) values(${count["total"]})`);

            //大昔のトレンドのためにテーブル確認
            let flag;
            try {
                await DB.queryp(`select 1 from twitter_trend_delta${track_list[i]["id"]}`);
                flag = false;
            } catch (e){
                flag = true;
            }
            //tableない場合
            if(flag) {
                await DB.queryp(`create table twitter_trend_delta${track_list[i]["id"]} (date timestamp default current_timestamp, hotness float)`);
            }

            //delta追加
            await DB.queryp(`insert into twitter_trend_delta${track_list[i]["id"]} (hotness) values(${count["delta"]})`);

            if(count["total"] < 0.3 * max){
                await DB.queryp(`delete from twitter_tracking where id=${track_list[i]["id"]}`);
                await DB.queryp(`insert into twitter_tracked (id) values(${track_list[i]["id"]})`);
            }
        }

        const max_track_id_obj = await DB.queryp(`select max(id) from twitter_tracking`);
        const max_track_id = max_track_id_obj["max(id)"];

        const max_trend_id_obj = await DB.queryp(`select max(id) from twitter_list`);
        const max_trend_id = max_trend_id_obj["max(id)"];

        const tracking_num_obj = await DB.queryp(`select count(id) from twitter_tracking`);
        let tracking_num = tracking_num_obj["count(id)"];

        let start;
        if(max_trend_id-10 <= max_track_id+1) start = max_track_id+1;
        else start = max_trend_id-10;

        for(let i=start; i<=max_trend_id; i++){
            if(tracking_num >= 250) break;
            tracking_num++;
            await DB.queryp(`insert into twitter_tracking (id) values(${i})`);
        }

    } catch(e){
        console.log(e);
    };
}
