const request = require("request-promise-native");

/**
 * table_id -> data
 * @param {int} id trend id
 * @param {string} since yyyy-MM-dd-HH-mm-ss (optional)
 * @returns {array} data (If the table is not found, [] will be returned.)
 */
module.exports = async function getAIDataById(id,since){
    if(id == -1 || id == null) return [];
    let data = await request({
        url: 'http://172.30.0.12:8000/?id=' + id,
        method: 'GET'
    });
    if(data == undefined) return [];
    return data;
}