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
    const min = new Date().getMinutes();
    let token_type;
    if((0 <= min && min < 5) || (20 <= min && min < 25) || (40 <= min && min < 45)){
        token_type = 1;
    } else if((5 <= min && min < 10) || (25 <= min && min < 30) || (45 <= min && min < 50)){
        token_type = 2;
    } else if((10 <= min && min < 15) || (30 <= min && min < 35) || (50 <= min && min < 55)){
        token_type = 3;
    } else {
        token_type = 4;
    }
    
    try {
        await TwitterAPI.getTrend(token_type);
        console.log(get_date_string()+" successfully added all trend data with token" + token_type);
        fs.appendFileSync( "./cron.log" , get_date_string()+": successfully added all trend data with token" + token_type + "\n" );
    } catch {
        console.log(get_date_string()+" failed to add (all / part of) trend data with token" + token_type);
        fs.appendFileSync( "./cron.log" , get_date_string()+": failed to add (all / part of) trend data with token" + token_type + "\n" );
    }
}

// 毎時0,20,40,5,25,45,10,30,50,15,35,55 分
cron.schedule('0,20,40,5,25,45,10,30,50,15,35,55 * * * *', () => {
    main();    
}, {
    timezone: "Asia/Tokyo"
});