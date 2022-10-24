const Twitter = require('./TwitterAPI.js');

/**
 * trend name -> popular tweets(id)
 * @param {int} token_type token type
 * @returns {array} popular tweets(id)
 */
module.exports = async function getPopularTweetsByName(token_type,name){
    if(name == "" || name == null) return [];
    const tweets = await Twitter.search(token_type,name,10);
    const ret = [];
    for(const tweet of tweets){
        ret.push({"id": tweet.id, "fav": tweet.favorite_count});
    }
    ret.sort((a,b)=>{
       return b.fav - a.fav; 
    });

    return ret;
}