const { TwitterApi } = require('twitter-api-v2');
const DockerUtil = require("../../rest-api/dockerUtil.js");

class Twitter {

    constructor() {
        this.client = undefined;
    }

    async #getClient(){
        if(this.client != undefined) return;

        this.client = new TwitterApi(await DockerUtil.getSecret("TWITTER_BEARER_TOKEN"));
        this.roClient = this.client.readOnly;

        /**
         * See /twitter-api-v2/dist/v2/client.v2.read.js
         */
        this.v1Client = this.client.v1;
        this.v2Client = this.client.v2;
    }

    /**
     * 
     * @param {string} str a string you want to search twitter for
     * @returns {string[]} result 
     */
    async search(str){
        await this.#getClient();

        const params = {
            max_results: 100,
            query: this.#generate_query(str),
        }

        const res = await this.v2Client.get('tweets/search/recent', params, { fullResponse: true });
        const tweets = res["data"]["data"]
        return tweets;
    }

    /**
     * 
     * @param {int} id WOEID default:23424856(Japan)
     * @returns {string[]} result 
     */
    async get_trend(woeId=23424856){
        await this.#getClient();
        const params = {
            id: woeId
        }
        const ret = await this.v1Client.get('trends/place.json', params, { fullResponse: true });
        const trends = [...ret["data"][0]["trends"]];
        const result = [];
        const promises = [], promise_names = [];
        for(const trend of trends){
            //nameとtweet_volumeだけにする １万未満でnullなら所得  制限注意
            if(trend["tweet_volume"] == null){
                promises.push(this.count(trend["name"]));
                promise_names.push(trend["name"]);
            } else {
                result.push({
                    "name": trend["name"],
                    "tweet_volume": trend["tweet_volume"]
                });
            }
        };
        const all_res = await Promise.all(promises);
        for(let i = 0; i<promise_names.length; i++){
            result.push({
                "name": promise_names[i],
                "tweet_volume": all_res[i]
            });
        }
        return result;
    }

    /**
     * count tweets (total)
     * @param {string} str a string you want to search twitter for
     * @returns {int} result 
     */
    async count(str){
        await this.#getClient();
        const params = {
            query: this.#generate_query(str),
            granularity: "day"
        }

        const ret = await this.v2Client.get('tweets/counts/recent', params, { fullResponse: true });
        const num = Number(ret["data"]["meta"]["total_tweet_count"]);
        return num;
    }
    
    /**
     * generate query str
     * @param {string} str a string you want to search twitter for
     * @returns {string} real query
     */
    #generate_query(str){
        if(str.charAt(0) == "#") return str;
        else return '"'+str+'"';
    }
}

module.exports = new Twitter();