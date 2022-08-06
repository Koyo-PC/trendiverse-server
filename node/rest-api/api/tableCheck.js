const DB = require("../db/TrendiverseDB.js");

/**
 * This function checks if there is a table named ${name} in your database.
 * 
 * @param {string} name table name
 * @returns {bool}
 */

module.exports = async function tableCheck(name) {
    try{
        await DB.queryp(`select 1 from ${name} limit 1`);
        return true;
    } catch {
        return false;
    }
}