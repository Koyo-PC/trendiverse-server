const DB = require("../../rest-api/db/TrendiverseDB.js");
const getIdByName = require("./getIdByName.js");
const getDataById = require("./getDataById.js");

/**
 * name -> name(UTF16) -> table_id -> data
 * @param {string} name trend name
 * @returns {array} data (If the table is not found, [] will be returned.)
 */
module.exports = async function getDataByName(name){
    const id = await getIdByName(name);
    return await getDataById(id);
}