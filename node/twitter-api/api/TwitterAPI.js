const { TwitterApi } = require('twitter-api-v2');
const DockerUtil = require("../../rest-api/dockerUtil.js");

class Twitter {

    constructor() {
        this.client = undefined;
        this.type = undefined;
    }

    /**
     * 
     * @param {int} token_type token type (default = 1)
     */
    async #getClient(token_type=1){
        // if(this.client != undefined) return;

        // const min = new Date().getMinutes();
        // if((0 <= min && min < 10) || (20 <= min && min < 30) || (40 <= min && min < 50)){
        //     if(this.type == 1) return;
        //     else this.type = 1;
        // } else {
        //     if(this.type == 2) return;
        //     else this.type = 2;
        // }
        if(this.type == token_type) return;
        const token = await DockerUtil.getSecret(`TWITTER_BEARER_TOKEN${token_type}`);

        if(token == ""){
            this.client = undefined;
            this.roClient = undefined;
            this.v1Client = undefined;
            this.v2Client = undefined;
            console.log("Twitter token is unset. aborted");
            return;
        }

        this.client = new TwitterApi(token);
        this.roClient = this.client.readOnly;

        /**
         * See /twitter-api-v2/dist/v2/client.v2.read.js
         */
        this.v1Client = this.client.v1;
        this.v2Client = this.client.v2;
        this.type = token_type;
    }

    /**
     * 
     * @param {int} token_type token type
     * @param {string} str a string you want to search twitter for
     * @param {int} num the number of tweets you want to get
     * @returns {array} result (popular, raw)
     */
    async search(token_type,str,num=10){
        await this.#getClient(token_type);
        if(this.client == undefined) return [];

        const params = {
            count: num,
            result_type: "popular",
            q: this.#generate_query(str),
        }

        const res = await this.v1Client.get('search/tweets.json', params, { fullResponse: true });
        const tweets = res["data"]["statuses"];
        return tweets;
    }

    /**
     * 
     * @param {int} token_type token type
     * @param {int} id WOEID default:23424856(Japan)
     * @returns {array} result 
     */
    async getTrend(token_type,woeId=23424856){
        await this.#getClient(token_type);
        if(this.client == undefined) return [];

        const params = {
            id: woeId
        }
        const ret = await this.v1Client.get('trends/place.json', params, { fullResponse: true });
        const trends = [...ret["data"][0]["trends"]];
        const result = [];
        const promises = [], promise_names = [];

        const name_list = [];
        for(const trend of trends){
            //重複確認(稀にあるので)
            if(name_list.includes(trend["name"])) continue;
            else name_list.push(trend["name"]);

            promises.push(this.count(token_type,trend["name"]));
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
     * @param {int} token_type token type
     * @param {string} str a string you want to search twitter for
     * @returns {object} result {total: 過去七日間, delta: 過去一時間} 
     */
    async count(token_type,str){
        await this.#getClient(token_type);
        if(this.client == undefined) return {};

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