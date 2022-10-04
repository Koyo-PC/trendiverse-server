const DB = require("../db/TrendiverseDB.js");

/**
 * name -> data
 * @param {string} name table name
 * @returns {array} data (If the table is not found, [] will be returned.)
 */

module.exports = async function getDataByName(name){
    let data;
    try {
        data = await DB.queryp(`select * from ${name}`,true);
    } catch {
        return [];
    }
    return data;
}