import mysql from "mysql"
import {DockerUtil} from "../dockerUtil.js";
// ↓ 型注釈用
import Pool from "mysql/lib/Pool.js"
// import Connection from "mysql/lib/Connection"
import PoolConnection from "mysql/lib/PoolConnection.js"
// import Query from "mysql/lib/Connection/protocol/sequences/Query"
// ↑ 型注釈用

class TrendiverseDB {

    constructor() {
        /** @type {Pool} */
        this.pool = mysql.createPool({
            connectionLimit : 10,
            // host: DockerUtil.getSecret("DB_HOST"),
            host: "172.30.0.11",
            port: 3306,
            // user: DockerUtil.getSecret("DB_USER"),
            user: "root",
            // password: DockerUtil.getSecret("DB_PASSWORD"),
            password: DockerUtil.getSecret("DB_ROOT_PASSWORD"),
            database: DockerUtil.getSecret("DB_NAME"),
        });
    }

    /**
     * @returns {PoolConnection}
     */
    async #getConnection() {
        return await new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) reject(err);
                else resolve(connection);
            })
        });
    }

    async #beginTransaction(connection) {
        return await new Promise((resolve, reject) => {
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
    async #query(connection, statement, params) {
        return await new Promise((resolve, reject) => {
            connection.query(statement, params, (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results, fields);
                }
            });
        });
    }

    async #commit(connection) {
        return await new Promise((resolve, reject) => {
            connection.commit((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(err);
                }
            });
        });
    };

    async #rollback(connection, err) {
        return await new Promise((resolve, reject) => {
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
     * @returns {string | string[]} - 検索結果、またはぞの配列
     */
    async queryp(query_sentence = "", all = false, arg = []) {
        /** @type {PoolConnection} */
        let connection;
        try {
            connection = await this.#getConnection(this.pool);
            const res = await this.#query(connection, query_sentence, arg);
            connection.release();

            //配列で帰ってきたら
            if (Array.isArray(res) && !all) return res[0];
            else return res;
        } catch (err) {
            // connection.release();
            throw err;
        }
    };
}

export default new TrendiverseDB();