import fs from "fs/promises";

/**
 * @param {string} name
 * @returns {string}
 */
export class DockerUtil {
    static async getSecret(name) {
        const data = await fs.readFile("/run/secrets/" + name);
        return data.toString();
    }
}