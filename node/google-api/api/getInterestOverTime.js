const googleTrends = require('google-trends-api');

module.exports = async function getInterestOverTime(){
    try {
        const res = await googleTrends.interestOverTime({
            keyword: "JR東日本",
            startTime: new Date(Date.now() - (7*24 * 60 * 60 * 1000)),
            geo: 'JP',
            hl: "ja"
        });
        const arr = JSON.parse(res)["default"]["timelineData"];

        return arr;
    } catch {
        return [];
    }
}   