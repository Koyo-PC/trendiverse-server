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
        await TwitterAPI.getTrend();
        console.log(get_date_string()+" successfully added all trend data");
        fs.appendFileSync( "./cron.log" , get_date_string()+": successfully added all trend data\n" );
    } catch {
        console.log(get_date_string()+" failed to add (all / part of) trend data");
        fs.appendFileSync( "./cron.log" , get_date_string()+": failed to add (all / part of) trend data\n" );
    }
}

cron.schedule('*/6 * * * *', () => {
    main();    
}, {
    timezone: "Asia/Tokyo"
});
