const getIdByName = require("./getIdByName.js");
const getAIDataById = require("./getAIDataById.js");

/**
 * name -> name(UTF16) -> table_id -> data
 * @param {string} name trend name
 * @param {string} since yyyy-MM-dd-HH-mm-ss (optional)
 * @returns {array} data (If the table is not found, [] will be returned.)
 */
module.exports = async function getAIDataByName(name,since){
    const id = await getIdByName(name);
    return await getAIDataById(id,since);
}