const http = require("http");
const TrendiverseAPI = require("./api/api.js");

/**
 * Notice that some functions return a promise. You need to wait until it resolves itself.
 */

function main() {
    http.createServer(async (req, res) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const path = url.pathname;
        const params = url.searchParams;
        if (path === "/list") {
            res.writeHead(200, {"content-type": "application/json"});
            const list = await TrendiverseAPI.onListRequest();
            res.end(list);
        } else if (path === "/info") {
            /** 
             * yyyy-MM-dd-HH-mm-ss 
             * example: /info?name=Hoge&last_request=2022-01-01-00-00-00
            */
            const last_request = params.get("last_request");
            /** String, URL-encoded */
            const name = params.get("name");
            if (last_request === null) {
                res.writeHead(400, {"content-type": "text/plain"});
                res.end("parameter 'last_request' is required.");
                return;
            } else if (name === null) {
                res.writeHead(400, {"content-type": "text/plain"});
                res.end("parameter 'name' is required.");
                return;
            }
            res.writeHead(200, {"content-type": "application/json"});
            const info = await TrendiverseAPI.onInfoRequest(last_request,name);
            res.end(info);
        } else {
            res.writeHead(404, {"content-type": "text/plain"});
            res.end("404 Not Found");
            return;
        }
    }).listen(8080);
}
main();