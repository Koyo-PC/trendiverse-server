const getNameById = require("./getNameById.js");
const getPopularTweetsByName = require("./getPopularTweetsByName.js");

/**
 * table_id -> popular tweets(id)
 * @param {int} token_type token type
 * @param {string} name trend name
 * @returns {array} popular tweets(id)
 */
module.exports = async function getPopularTweetsById(token_type,id){
    const name = await getNameById(id);
    return await getPopularTweetsByName(token_type,name);
}