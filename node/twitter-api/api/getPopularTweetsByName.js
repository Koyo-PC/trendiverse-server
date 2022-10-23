const Twitter = require('./TwitterAPI.js');

/**
 * trend name -> popular tweets(id)
 * @returns {array} popular tweets(id)
 */
module.exports = async function getPopularTweetsByName(name){
    if(name == "" || name == null) return [];
    const tweets = await Twitter.search(name,10);
    const ret = [];
    for(tweet of tweets){
        ret.push({"id": tweet.id, "fav": tweet.favorite_count});
    }
    ret.sort((a,b)=>{
       return b.fav - a.fav; 
    });

    return ret;
}