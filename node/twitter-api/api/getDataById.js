const DB = require("../../rest-api/db/TrendiverseDB.js");
const request = require("request-promise");
/**
 * table_id -> data
 * @param {int} id trend id
 * @param {string} since yyyy-MM-dd-HH-mm-ss (optional)
 * @returns {array} data (If the table is not found, [] will be returned.)
 */
module.exports = async function getDataById(id,since){
    let data;
    if(id == -1) return [];
    
    try{
        if(since == "") data = await DB.queryp(`select * from twitter_trend${id}`,true);
        else data = await DB.queryp(`select * from twitter_trend${id} where date > "${since}"`,true);
    } catch{
        return [];
    }
    if(data == undefined) return [];
    let predict_data = await request({
        url: 'https://172.30.0.12:8800/?id=' + id,
        method: 'GET'
    });
    console.log(data);
    data["predict"] = predict_data;
    console.log(data);
    return data;
}