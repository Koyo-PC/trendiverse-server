const DB = require("../db/TrendiverseDB.js");

/**
 * table list (all)
 * @returns {array} You must resolve this promise to get a result.
 */

module.exports = async function onListRequest(){  
    const tables = await DB.queryp("show tables", true);
    if(tables == undefined) return [];
    let new_tables = [];
    for(table of tables){
        new_tables.push({"name": `${table["Tables_in_data"]}` });
    }
    return new_tables;
}