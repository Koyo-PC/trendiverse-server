const TwitterAPI = require("../api/api.js");
const fs = require("fs");
const cron = require('node-cron');

/**
 * 
 * @param {Date} date
 * @returns {string} 2021/12/1 10:57:23
 */
function get_date_string(date=new Date()){
    const str = date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
    return str;
}

async function main(){
    try {
        const min = new Date().getMinutes();
        let token_type;
        if((0 <= min && min < 10) || (20 <= min && min < 30) || (40 <= min && min < 50)){
            token_type = 1;
        } else {
            token_type = 2;
        }
        await TwitterAPI.getTrend(token_type);
        console.log(get_date_string()+" successfully added all trend data");
        fs.appendFileSync( "./cron.log" , get_date_string()+": successfully added all trend data\n" );
    } catch {
        console.log(get_date_string()+" failed to add (all / part of) trend data");
        fs.appendFileSync( "./cron.log" , get_date_string()+": failed to add (all / part of) trend data\n" );
    }
}

// 毎時0,20,40, 10,30,50 分
cron.schedule('0,10,20,30,40,50 * * * *', () => {
    main();    
}, {
    timezone: "Asia/Tokyo"
});