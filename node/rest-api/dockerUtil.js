const fs = require("fs/promises");

/**
 * @param {string} name
 * @returns {string}
 */
class DockerUtil {
    static async getSecret(name) {
        const data = await fs.readFile("/run/secrets/" + name, { encoding: "utf8" });
        //改行文字消す
        const res_data = data.replace(/\r?\n/g,""); 
        return res_data.toString();
    }
}

module.exports = DockerUtil;