const http = require("http");
const googleAPI = require("./api/api.js");

/**
 * Notice that some functions return a promise. You need to wait until it resolves itself.
 * Please endcode your URL params
 */

function main() {    
    http.createServer(async (req, res) => {
        const user_ip = req.socket.remoteAddress;
        const match = user_ip.match(/172\.30\.0\./);
        const match_app = user_ip.match(/138\.2\.55\.39/);
        if(match == null && match_app == null){
            res.writeHead(404, {"content-type": "text/plain"});
            res.end("404 Not Found");
            return;
        }

        //ex. curl -X POST -H "Content-Type: application/json" -d '{"name":"太郎", "age":"30"}' localhost:8082
        if (req.method == 'POST') {
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

        if(req.method == "GET"){
            const url = new URL(req.url, `http://${req.headers.host}`);
            const path = url.pathname;
            const params = url.searchParams;
            if (path === "/getDailyTrends") {
                /** 
                 * example: /getDailyTrends?
                */
                res.writeHead(200, {"content-type": "application/json"});
                const list = await googleAPI.getDailyTrends();
                const json = JSON.stringify({list});
                res.end(json);
            } else if (path === "/getInterestOverTime") {
                /** 
                 * example: /getInterestOverTime?name=台風接近
                 * OR
                 * example: /getInterestOverTime?name=台風接近&since=2022-06-01
                */
                res.writeHead(200, {"content-type": "application/json"});
                const name = params.get("name");
                const since = params.get("since");
                const list = await googleAPI.getInterestOverTime(name,since);
                const json = JSON.stringify({list});
                res.end(json);
            } else {
                res.writeHead(404, {"content-type": "text/plain"});
                res.end("404 Not Found");
                return;
            }
        }
    }).listen(8082);
}
main();