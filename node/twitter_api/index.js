const http = require("http");
const TwitterAPI = require("./api/api.js");

/**
 * Notice that some functions return a promise. You need to wait until it resolves itself.
 */

function main() {
    //TO DO: IP制限
    http.createServer(async (req, res) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const path = url.pathname;
        const params = url.searchParams;
        if (path === "/getTrend") {
            res.writeHead(200, {"content-type": "application/json"});
            const list = await TwitterAPI.getTrend();
            const json = JSON.stringify({list},undefined,2); //beautiflied
            res.end(json);
        } else if (path =="/getIdByName"){
            res.writeHead(200, {"content-type": "application/json"});
            const name = params.get("name");
            /** 
             * example: /getIdByName?name=艦これ
            */
            const num = await TwitterAPI.getIdByName(name);
            const json = JSON.stringify(num,undefined,2); //beautiflied
            res.end(json);
        } else if (path == "/getDataByName"){
            res.writeHead(200, {"content-type": "application/json"});
            const name = params.get("name");
            /** 
             * example: /getDataByName?name=艦これ
            */
            const list = await TwitterAPI.getDataByName(name);
            const json = JSON.stringify({list},undefined,2); //beautiflied
            res.end(json);
        } else if (path == "/getDataById"){
            res.writeHead(200, {"content-type": "application/json"});
            const id = params.get("id");
            /** 
             * example: /getDataById?id=1
            */
            const list = await TwitterAPI.getDataById(id);
            const json = JSON.stringify({list},undefined,2); //beautiflied
            res.end(json);
        } else if (path == "/getNameById"){
            res.writeHead(200, {"content-type": "application/json"});
            const id = params.get("id");
            /** 
             * example: /getNameById?id=1
            */
            const string = await TwitterAPI.getNameById(id);
            const json = JSON.stringify(string,undefined,2); //beautiflied
            res.end(json);
        } else if (path == "/getList"){
            res.writeHead(200, {"content-type": "application/json"});
            /** 
             * example: /getNameById?id=1
            */
            const string = await TwitterAPI.getList();
            const json = JSON.stringify(string,undefined,2); //beautiflied
            res.end(json);
        } else {
            res.writeHead(404, {"content-type": "text/plain"});
            res.end("404 Not Found");
            return;
        }
    }).listen(8081);
}
main();