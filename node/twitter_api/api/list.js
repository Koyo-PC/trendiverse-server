//experimental feature

const twitter = require('twitter');
const DockerUtil = require("../../rest-api/dockerUtil.js");

module.exports = async function onListRequest(){
    const client = new twitter({
        consumer_key: await DockerUtil.getSecret("TWITTER_CONSUMER_KEY"),
        consumer_secret: await DockerUtil.getSecret("TWITTER_CONSUMER_SECRET"),
        access_token_key: await DockerUtil.getSecret("TWITTER_ACCESS_TOKEN_KEY"),
        access_token_secret: await DockerUtil.getSecret("TWITTER_ACCESS_TOKEN_SECRET"),
    });

    const params = {
        id: 23424856
    };

    try{
        const json = await client.get('trends/place', params)
        const res = JSON.stringify(json,undefined,2);
        return res;
    } catch (e) {
        console.log(e);
        return;
    }
}