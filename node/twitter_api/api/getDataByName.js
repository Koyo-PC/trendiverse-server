const DB = require("../../rest-api/db/TrendiverseDB.js");
const getIdByName = require("./getIdByName.js");
const getDataById = require("./getDataById.js");

/**
 * name -> name(UTF16) -> table_id -> data
 * @param {string} name trend name
 * @param {string} since yyyy-MM-dd-HH-mm-ss (optional)
 * @returns {array} data (If the table is not found, [] will be returned.)
 */
module.exports = async function getDataByName(name,since){
    const id = await getIdByName(name);
    return await getDataById(id,since);
}