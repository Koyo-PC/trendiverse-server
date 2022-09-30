const http = require("http");
const GoogleAPI = require("./api/api.js");

/**
 * Notice that some functions return a promise. You need to wait until it resolves itself.
 * Please endcode your URL params
 */

function main() {    
    http.createServer(async (req, res) => {

        if (req.method == 'POST') {
            const user_ip = req.socket.remoteAddress;
            const match = user_ip.match(/172\.30\.0\./);
            if(match == null){
                res.writeHead(404, {"content-type": "text/plain; charset=utf-8"});
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
                            //ex. curl -X POST -H "Content-Type: application/json; charset=utf-8" -d '{ "id": 1, "list": [ {"date":"2022-01-01-00-00-00" ,"hotness": 1234}, {"date":"2022-01-02-00-00-00", "hotness": 5678} ] }' localhost:8082
                            const ret = await GoogleAPI.addToDB(id,list);
                            res.end(`${ret}`);
                        } else if(name != undefined ){
                            //ex. curl -X POST -H "Content-Type: application/json; charset=utf-8" -d '{ "name": "台風接近", "list": [ {"date":"2022-01-01-00-00-00" ,"hotness": 1234}, {"date":"2022-01-02-00-00-00", "hotness": 5678} ] }' localhost:8082
                            await GoogleAPI.addNamesToDB([{"name":name}]);
                            const table_id = await GoogleAPI.getIdByName(name);
                            const ret = await GoogleAPI.addToDB(table_id,list);
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
            if (path === "/getDailyTrends") {
                /** 
                 * example: /getDailyTrends?
                */
                res.writeHead(200, {"content-type": "application/json; charset=utf-8"});
                const list = await GoogleAPI.getDailyTrends();
                const json = JSON.stringify({list});
                res.end(json);
            } else if (path === "/getInterestOverTime") {
                /** 
                 * example: /getInterestOverTime?name=台風接近
                 * OR
                 * example: /getInterestOverTime?name=台風接近&since=2022-06-01
                */
                res.writeHead(200, {"content-type": "application/json; charset=utf-8"});
                const name = params.get("name");
                const since = params.get("since");
                const list = await GoogleAPI.getInterestOverTime(name,since);
                const json = JSON.stringify({list});
                res.end(json);
            } else if (path === "/getList") {
                /** 
                 * example: /getList?
                */
                res.writeHead(200, {"content-type": "application/json; charset=utf-8"});
                const list = await GoogleAPI.getList();
                const json = JSON.stringify({list});
                res.end(json);
            } else if (path =="/getIdByName"){
                res.writeHead(200, {"content-type": "application/json; charset=utf-8"});
                const name = params.get("name");
                /** 
                 * example: /getIdByName?name=艦これ
                */
                const num = await GoogleAPI.getIdByName(name);
                const json = JSON.stringify(num);
                res.end(json);
            } else if (path == "/getNameById"){
                res.writeHead(200, {"content-type": "application/json; charset=utf-8"});
                const id = params.get("id");
                /** 
                 * example: /getNameById?id=1
                */
                const string = await GoogleAPI.getNameById(id);
                const json = JSON.stringify(string);
                res.end(json);
            } else if (path == "/getAIDataById"){
                res.writeHead(200, {"content-type": "application/json; charset=utf-8"});
                const id = params.get("id");
                const since = params.get("since");
                /** 
                 * example: /getAIDataById?id=1
                 * OR
                 * example: /getAIDataById?id=1&since=2022-01-01-00-00-00
                */
                const list = await GoogleAPI.getAIDataById(id,since);
                const json = JSON.stringify({list});
                res.end(json);
            } else if (path == "/getAIDataByName"){
                res.writeHead(200, {"content-type": "application/json; charset=utf-8"});
                const name = params.get("name");
                const since = params.get("since");
                /** 
                 * example: /getAIDataByName?name=艦これ
                 * OR
                 * example: /getAIDataByName?name=艦これ&since=2022-01-01-00-00-00
                */
                const list = await GoogleAPI.getAIDataByName(name,since);
                const json = JSON.stringify({list});
                res.end(json);
            } else {
                res.writeHead(404, {"content-type": "text/plain; charset=utf-8"});
                res.end("404 Not Found");
                return;
            }
        }
    }).listen(8082);
}
main();