import { createPool } from 'mysql2/promise';
import 'dotenv/config';

class Database {
    static #pool = null;

    static getPool() {
        if (!Database.#pool) {
            const sslCa = process.env.DB_SSL_CA?.replace(/\\n/g, '\n');
            Database.#pool = createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                port: Number(process.env.DB_PORT || 3306),
                ...(process.env.DB_SSL === 'true' ? { ssl: sslCa ? { ca: sslCa } : {} } : {}),
                waitForConnections: true,
                connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
                queueLimit: 0
            });
        }
        return Database.#pool;
    }

    static async connect() {
        const connection = await Database.getPool().getConnection();
        connection.release();
    }
}

export default Database;
