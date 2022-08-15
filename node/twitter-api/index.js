const http = require("http");
const TwitterAPI = require("./api/api.js");
const getDataById = require("./api/getDataById.js");

/**
 * Notice that some functions return a promise. You need to wait until it resolves itself.
 * Please endcode your URL params
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
                    //encodeしなくてOK
                    try{
                        const obj = JSON.parse(body);
                        const id = obj["id"];
                        const name = obj["name"];
                        const list = obj["list"];
                        
                        if(id != undefined){
                            //ex. curl -X POST -H "Content-Type: application/json" -d '{ "id": 1, "list": [ {"date":"2022-01-01-00-00-00" ,"hotness": 1234}, {"date":"2022-01-02-00-00-00", "hotness": 5678} ] }' localhost:8081
                            const ret = await TwitterAPI.addToDB(id,list);
                            res.end(`${ret}`);
                        } else if(name != undefined ){
                            //ex. curl -X POST -H "Content-Type: application/json" -d '{ "name": "台風接近", "list": [ {"date":"2022-01-01-00-00-00" ,"hotness": 1234}, {"date":"2022-01-02-00-00-00", "hotness": 5678} ] }' localhost:8081
                            const table_id = await TwitterAPI.getIdByName(name);
                            const ret = await TwitterAPI.addToDB(table_id,list);
                            res.end(`${ret}`);
                        } else {
                            res.end("-1");
                        }
                        
                    } catch {
                        res.end("-1");
                    }
                });
            }
        }

        if(req.method == "GET"){
            //encode必要
            const url = new URL(req.url, `http://${req.headers.host}`);
            const path = url.pathname;
            const params = url.searchParams;
            if (path === "/getTrend") {
                res.writeHead(200, {"content-type": "application/json"});
                const list = await TwitterAPI.getTrend();
                const json = JSON.stringify({list});
                res.end(json);
            } else if (path =="/getIdByName"){
                res.writeHead(200, {"content-type": "application/json"});
                const name = params.get("name");
                /** 
                 * example: /getIdByName?name=艦これ
                */
                const num = await TwitterAPI.getIdByName(name);
                const json = JSON.stringify(num);
                res.end(json);
            } else if (path == "/getDataByName"){
                res.writeHead(200, {"content-type": "application/json"});
                const name = params.get("name");
                const since = params.get("since");
                /** 
                 * example: /getDataByName?name=艦これ
                 * OR
                 * example: /getDataByName?name=艦これ&since=2022-01-01-00-00-00
                */
                const list = await TwitterAPI.getDataByName(name,since);
                const json = JSON.stringify({list});
                res.end(json);
            } else if (path == "/getDataById"){
                res.writeHead(200, {"content-type": "application/json"});
                const id = params.get("id");
                const since = params.get("since");
                /** 
                 * example: /getDataById?id=1
                 * OR
                 * example: /getDataById?id=1&since=2022-01-01-00-00-00
                */
                const list = await TwitterAPI.getDataById(id,since);
                const json = JSON.stringify({list});
                res.end(json);
            } else if (path == "/getNameById"){
                res.writeHead(200, {"content-type": "application/json"});
                const id = params.get("id");
                /** 
                 * example: /getNameById?id=1
                */
                const string = await TwitterAPI.getNameById(id);
                const json = JSON.stringify(string);
                res.end(json);
            } else if (path == "/getList"){
                res.writeHead(200, {"content-type": "application/json"});
                /** 
                 * example: /getList?
                */
                const list = await TwitterAPI.getList();
                const json = JSON.stringify({list});
                res.end(json);
            } else if (path == "/getAIDataById"){
                res.writeHead(200, {"content-type": "application/json"});
                const id = params.get("id");
                const since = params.get("since");
                /** 
                 * example: /getAIDataById?id=1
                 * OR
                 * example: /getAIDataById?id=1&since=2022-01-01-00-00-00
                */
                const list = await TwitterAPI.getAIDataById(id,since);
                const json = JSON.stringify({list});
                res.end(json);
            } else if (path == "/getAIDataByName"){
                res.writeHead(200, {"content-type": "application/json"});
                const name = params.get("name");
                const since = params.get("since");
                /** 
                 * example: /getAIDataByName?name=艦これ
                 * OR
                 * example: /getAIDataByName?name=艦これ&since=2022-01-01-00-00-00
                */
                const list = await TwitterAPI.getAIDataByName(name,since);
                const json = JSON.stringify({list});
                res.end(json);
            } else {
                res.writeHead(404, {"content-type": "text/plain"});
                res.end("404 Not Found");
                return;
            }
        }
    }).listen(8081);
}
main();