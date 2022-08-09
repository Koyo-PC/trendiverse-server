const mysql = require("mysql");
const DockerUtil = require("../dockerUtil.js");
const utf = require("./utf.js");
// ↓ 型注釈用
const Pool = require("mysql/lib/Pool.js");
// import Connection from "mysql/lib/Connection"
const PoolConnection = require("mysql/lib/PoolConnection.js");
// import Query from "mysql/lib/Connection/protocol/sequences/Query"
// ↑ 型注釈用

class TrendiverseDB {

    constructor() {
        this.pool = undefined;
    }

    async #createPool(){
        /** @type {Pool} */
        this.pool = mysql.createPool({
            connectionLimit : 10,
            host: "172.30.0.11",
            port: 3306,
            user: "root",
            password: await DockerUtil.getSecret("DB_ROOT_PASSWORD"),
            // host: DockerUtil.getSecret("DB_HOST"),
            // user: await DockerUtil.getSecret("DB_USER"),
            // password: await DockerUtil.getSecret("DB_PASSWORD"),
            database: await DockerUtil.getSecret("DB_NAME"),
        });
    }

    /**
     * @returns {PoolConnection}
     */
    #getConnection() {
        return new Promise((resolve, reject) => {
            //ERROR
            this.pool.getConnection((err, connection) => { 
                if (err) reject(err);
                else resolve(connection);
            });
        });
    }

    #beginTransaction(connection) {
        return new Promise((resolve, reject) => {
            connection.beginTransaction((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });
    }

    /**
     * @param {PoolConnection | Connection} connection
     * @param {string} statement
     * @param {string[]} params
     * @returns {string | string[]}
     */
    #query(connection, statement, params) {
        return new Promise((resolve, reject) => {
            connection.query(statement, params, (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results, fields);
                }
            });
        });
    }

    #commit(connection) {
        return new Promise((resolve, reject) => {
            connection.commit((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(err);
                }
            });
        });
    };

    #rollback(connection, err) {
        return new Promise((resolve, reject) => {
            connection.rollback(() => {
                reject(err);
            });
        });
    };

    /**
     * SQLクエリを実行します
     * @param {string} query_sentence - SQLクエリ文
     * @param {boolean} all - 結果が配列の時、要素すべてを返すか
     *     true : 配列全体, false : 最初の要素のみ
     * @param {string[]} arg - 引数の配列
     * @returns {Promise} - 検索結果、またはぞの配列を返すPromise
     */
    queryp(query_sentence = "", all = false, arg = []) {
        return new Promise(async (resolve,reject) => {
            /** @type {PoolConnection} */
            let connection;
            try {
                if(this.pool == undefined) await this.#createPool();
                connection = await this.#getConnection();
                let res = await this.#query(connection, query_sentence, arg);
                connection.release();

                if (Array.isArray(res)){ //array
                    res = Object.values(JSON.parse(JSON.stringify(res)));
                    if(!all) return resolve(res[0]);
                    else resolve(res);
                } else return resolve(res); //not array
            } catch (err) {
                // connection.release();
                reject(err);
            }
        });
    };

    /**
     * This function checks if there is a table named ${name} in your database.
     * 
     * @param {string} name table name
     * @returns {bool}
     */

    async tableCheck(name) {
        try{
            await this.queryp(`select 1 from ${name} limit 1`);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * 
     * @param {string} str
     * @returns {string} UTF16 
     */
    to_UTF16(str){
        return utf.array_to_string(utf.encodeUTF16(str));
    }

    /**
     * 
     * @param {string} utf16
     * @returns {string} normal string
     */
    to_STRING(utfStr){
        return utf.decodeUTF16(utf.string_to_array(utfStr));
    }
}

module.exports = new TrendiverseDB();