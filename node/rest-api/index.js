const http = require("http");
const TrendiverseAPI = require("./api/api.js");

/**
 * Notice that some functions return a promise. You need to wait until it resolves itself.
 */

function main() {
    http.createServer(async (req, res) => {

        if (req.method == 'POST') {
            const user_ip = req.socket.remoteAddress;
            const match = user_ip.match(/172\.30\.0\./);
            if(match == null && match_app == null){
                res.writeHead(404, {"content-type": "text/plain"});
                res.end("404 Not Found");
                return;
            } else {

                let body = '';

                req.on('data', function(chunk) {
                    body += chunk;
                });
                
                req.on('end', async function() {
                console.log(JSON.parse(body)["name"]);
                res.end("successfully posted");
                //DB処理
                });
            }
        }

        if(req.method == "GET"){ 
            const url = new URL(req.url, `http://${req.headers.host}`);
            const path = url.pathname;
            const params = url.searchParams;
            if (path === "/getList") {
                /** 
                 * example: /getList?
                */
                res.writeHead(200, {"content-type": "application/json"});
                const list = await TrendiverseAPI.getList();
                const json = JSON.stringify({list});
                res.end(json);
            } else if (path === "/getDataByName") {
                /** 
                 * example: /getDataByName?name=twitter_trend1
                */
                res.writeHead(200, {"content-type": "application/json"});
                const name = params.get("name"); //TABLE name

                const list = await TrendiverseAPI.getDataByName(name);
                const json = JSON.stringify({list},undefined,2);
                res.end(json);    
            } else {
                res.writeHead(404, {"content-type": "text/plain"});
                res.end("404 Not Found");
                return;
            }
        }
    }).listen(8080);
}
main();