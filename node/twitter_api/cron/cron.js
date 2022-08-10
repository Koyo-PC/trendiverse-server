const TwitterAPI = require("../api/api.js");

async function main(){
    await TwitterAPI.getTrend();
}

main();