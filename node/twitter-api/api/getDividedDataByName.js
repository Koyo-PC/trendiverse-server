const getIdByName = require("./getIdByName.js");
const getDividedDataById = require("./getDividedDataById.js");

/**
 * name -> name(UTF16) -> table_id -> divided data
 * @param {string} name trend name
 * @param {string} since yyyy-MM-dd-HH-mm-ss (optional)
 * @returns {array} data (If the table is not found, [] will be returned.)
 */
module.exports = async function getDividedDataByName(name,since){
    const id = await getIdByName(name);
    return await getDividedDataById(id,since);
}