const getDataById = require("./getDataById.js");

/**
 * table_id -> devided data
 * @param {int} id trend id
 * @param {string} since yyyy-MM-dd-HH-mm-ss (optional)
 * @returns {array} data (If the table is not found, [] will be returned.)
 */
 module.exports = async function getDividedDataById(id,since){
    let raw = await getDataById(id,since);
    raw.unshift({"date": "1970-01-01 00:00:00"});
    const len = raw.length;
    const ret = [];
    for(let i = 0; i<len-1; i++){
        const dateA = new Date(raw[i]["date"]);
        const dateB = new Date(raw[i+1]["date"]);

        const diff = (dateB.getTime() - dateA.getTime()) / (86400000); //1日=86400秒
        if(diff > 1){
            ret.push([]);
        }
        ret[ret.length-1].push(raw[i+1]);
    }
    return ret;
}
