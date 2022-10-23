const getIdByName = require("./getIdByName.js");
const getPopularDataById = require("./getPopularDataById.js");

/**
 * name -> name(UTF16) -> table_id -> data
 * @param {string} name trend name
 * @returns {array} popular tweets(id) (If the table is not found, [] will be returned.)
 */
module.exports = async function getPopularDataByName(name){
    const id = await getIdByName(name);
    return await getPopularDataById(id);
}