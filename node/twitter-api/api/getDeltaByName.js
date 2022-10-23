const getIdByName = require("./getIdByName.js");
const getDeltaById = require("./getDeltaById.js");

/**
 * name -> name(UTF16) -> table_id -> delta
 * @param {string} name trend name
 * @param {string} since yyyy-MM-dd-HH-mm-ss (optional)
 * @returns {array} delta (If the table is not found, [] will be returned.)
 */
module.exports = async function getDeltaByName(name,since){
    const id = await getIdByName(name);
    return await getDeltaById(id,since);
}