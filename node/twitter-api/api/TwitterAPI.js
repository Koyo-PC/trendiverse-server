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
    async getTrend(woeId=23424856){
        await this.#getClient();
        const params = {
            id: woeId
        }
        const ret = await this.v1Client.get('trends/place.json', params, { fullResponse: true });
        const trends = [...ret["data"][0]["trends"]];
        const result = [];
        const promises = [], promise_names = [];

        for(const trend of trends){
            promises.push(this.count(trend["name"]));
            promise_names.push(trend["name"]);
        }

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
     * @returns {object} result {total: 過去七日間, delta: 過去一時間} 
     */
    async count(str){
        await this.#getClient();
        const params = {
            query: this.#generate_query(str),
            granularity: "minute"
        }

        const ret = await this.v2Client.get('tweets/counts/recent', params, { fullResponse: true });
        const total = Number(ret["data"]["meta"]["total_tweet_count"]);
        let delta = 0;
        for(let i=1; i<=60; i++){ //後ろから60個
            const arr = ret["data"]["data"];
            delta += Number(arr[arr.length-i]["tweet_count"]);
        }
        return {"total":total, "delta": delta};
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