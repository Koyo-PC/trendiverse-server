const DB = require("../db/TrendiverseDB.js");

/**
 * table list (all)
 * @returns {array} You must resolve this promise to get a result.
 */

module.exports = async function getList(){  
    const tables = await DB.queryp("show tables", true);
    if(tables == undefined) return [];
    let new_tables = [];
    for(table of tables){
        new_tables.push({"name": `${table["Tables_in_db_test"]}` });
    }
    return new_tables;
}
