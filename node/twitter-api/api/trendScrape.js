const https = require('https'); 
const {JSDOM} = require('jsdom');
const getIdByName = require('./getIdByName.js');

/**
 * @param {string} date ex. 2022-10-29 (任意)
 * @returns {Array} trends
 */
module.exports = async function trendScrape(date){
    if(date == null) return [];
    const names = await getPromise();
    const idname = [];
    for(const name of names){
        const id = await getIdByName(name);
        idname.push({"id":id, "name":name});
    }
    return idname;

    //スクレイピングして加工して返す
    async function getPromise(){
        return new Promise((resolve,reject)=>{
            https.get(`https://jp.trend-calendar.com/trend/${date}.html`, (resp) => { 
                let data = ''; 

                resp.on('data', (chunk) => { 
                    data += chunk; 
                }); 

                resp.on('end',() => { 
                    const dom = new JSDOM(data)
                    const document = dom.window.document;
                    const res = document.querySelectorAll('div.readmoretable_line > div >a');
                    let count = 0;
                    const ret = [];
                    res.forEach((data)=>{
                        if(count < 50){
                            ret.push(data.innerHTML);
                        } else {
                            resolve(ret);
                        }
                        count++;
                    });
                });
            }).on("error", (err) => { 
                reject(err);
            });
        });
    }
}