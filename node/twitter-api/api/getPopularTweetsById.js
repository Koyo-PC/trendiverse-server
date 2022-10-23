const getNameById = require("./getNameById.js");
const getPopularTweetsByName = require("./getPopularTweetsByName.js");

/**
 * table_id -> popular tweets(id)
 * @param {string} name trend name
 * @returns {array} popular tweets(id)
 */
module.exports = async function getPopularTweetsById(id){
    const name = await getNameById(id);
    return await getPopularTweetsByName(name);
}