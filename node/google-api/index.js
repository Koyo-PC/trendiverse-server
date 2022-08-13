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
        if(match == null){
            res.writeHead(404, {"content-type": "text/plain"});
            res.end("404 Not Found");
            return;
        }

        const url = new URL(req.url, `http://${req.headers.host}`);
        const path = url.pathname;
        const params = url.searchParams;
        if (path === "/getDailyTrends") {
            res.writeHead(200, {"content-type": "application/json"});
            const list = await googleAPI.getDailyTrends();
            const json = JSON.stringify({list},undefined,2); //beautiflied
            res.end(json);
        } else if (path === "/getInterestOverTime") {
            res.writeHead(200, {"content-type": "application/json"});
            const list = await googleAPI.getInterestOverTime();
            const json = JSON.stringify({list},undefined,2); //beautiflied
            res.end(json);
        } else {
            res.writeHead(404, {"content-type": "text/plain"});
            res.end("404 Not Found");
            return;
        }
    }).listen(8082);
}
main();