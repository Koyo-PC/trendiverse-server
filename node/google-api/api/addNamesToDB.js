const DB = require("../../rest-api/db/TrendiverseDB.js");

/**
 * put trend name into your google DB
 * @param {array} arr array of trends
 */
module.exports = async function addTrendsToDB(arr){
    let promises = [];
    for (trend of arr){
        const name = trend["name"];

        promises.push(new Promise(async (resolve,reject) => {
            try {
                //リスト確認
                const res = await DB.queryp(`select id from google_list where name="${DB.to_UTF16(name)}"`);

                if(res == undefined){ 
                    await DB.queryp(`insert into google_list (name) values("${DB.to_UTF16(name)}")`);
                }
                resolve();
            } catch(e){
                console.log(e);
                reject(e);
            };
        }));

        //コネクション不足のため
        if(promises.length == 1){
            await Promise.all(promises)
                .catch((e)=>{
                    console.log(e)}
                );
            promises = [];
        }
    };

    await Promise.all(promises)
        .catch((e)=>{
            console.log(e)}
        );
}