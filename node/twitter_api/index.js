const http = require("http");
const TwitterAPI = require("./api/api.js");

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
            const list = await TwitterAPI.onListRequest();
            res.end(list);
        } else {
            res.writeHead(404, {"content-type": "text/plain"});
            res.end("404 Not Found");
            return;
        }
    }).listen(8081);
}
main();