const googleTrends = require('google-trends-api');

/**
 * 
 * @param {string} name trend name
 * @param {string} since yyyy-mm-dd
 * @returns {array} 
 * like
 * {
 *    "time": "1654992000",
 *    "formattedAxisTime": "2022/06/12",
 *    "value": 68
 *  }
 */
module.exports = async function getInterestOverTime(name="",since="2004-01-01"){
    try {
        const res = await googleTrends.interestOverTime({
            keyword: name,
            startTime: new Date(since),
            geo: 'JP',
            hl: "ja",
            granularTimeResolution: false
        });
        const arr = JSON.parse(res)["default"]["timelineData"];
        const ret_arr = [];
        for(let i=0; i<arr.length; i++){
            const time = arr[i]["time"];
            const formattedAxisTime = arr[i]["formattedAxisTime"].replace(/\//g,"-");
            const value = arr[i]["value"][0]/100;
            ret_arr.push({"time": time, "formattedAxisTime": formattedAxisTime, "value": value});
        }
        return ret_arr;
    } catch {
        return [];
    }
}   