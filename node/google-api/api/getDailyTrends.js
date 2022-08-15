const googleTrends = require('google-trends-api');
const addNamesToDB = require('./addNamesToDB.js');

//一時間おきに更新
module.exports = async function getDailyTrends(){
    try {
        const res = await googleTrends.dailyTrends({
            geo: 'JP',
            hl: "ja"
        });
        const arr = JSON.parse(res)["default"]["trendingSearchesDays"][0]["trendingSearches"];
        const ret_arr = [];
        for(let i=0; i<arr.length; i++){
            const trend = arr[i]["title"]["query"];
            let traffic = arr[i]["formattedTraffic"];
            traffic = Number(traffic.replace(/万\+/,"0000"));
            ret_arr.push({"name": trend, "traffic": traffic});
        }

        await addNamesToDB(ret_arr);

        return ret_arr;
    } catch {
        return [];
    }
}   