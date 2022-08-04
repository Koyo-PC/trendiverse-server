import http from "http"
import {TrendiverseAPI} from "./api/api.js";

function main() {
    http.createServer((req, res) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const path = url.pathname;
        const params = url.searchParams;
        if (path === "/list") {
            // last_request: yyyy-MM-dd-HH-mm-ss
            // example: /list?last_request=2022-01-01-00-00-00
            const last_request = params.get("last_request");
            console.log(last_request)
            if (last_request === null) {
                res.writeHead(400, {"content-type": "text/plain"});
                res.end("parameter 'last_request' is required.");
                return;
            }
            res.writeHead(200, {"content-type": "application/json"});
            res.end(TrendiverseAPI.onListRequest(last_request));
        } else if (path === "/data") {
            // last_request: yyyy-MM-dd-HH-mm-ss
            // name: String, URL-encoded
            // example: /info?name=Hoge&last_request=2022-01-01-00-00-00
            const last_request = params.get("last_request");
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
            res.end(TrendiverseAPI.onDataRequest(last_request, name));
        } else if (path === "/info") {
            // last_request: yyyy-MM-dd-HH-mm-ss
            // name: String, URL-encoded
            // example: /info?name=Hoge&last_request=2022-01-01-00-00-00
            const last_request = params.get("last_request");
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
            res.end(TrendiverseAPI.onInfoRequest(last_request, name));
        } else {
            res.writeHead(404, {"content-type": "text/plain"});
            res.end("404 Not Found");
            return;
        }
    }).listen(8080);
}
main();