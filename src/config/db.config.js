import { createPool } from 'mysql2/promise';
import 'dotenv/config';

export class Database {
    static #pool = null;

    static getPool() {
        if (!Database.#pool) {
            Database.#pool = createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                port: Number(process.env.DB_PORT || 3306),
                waitForConnections: true,
                connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
                queueLimit: 0
            });
        }
        return Database.#pool;
    }

    static async connect() {
        let connection;
        try {
            connection = await Database.getPool().getConnection();
            console.log('Base de datos conectada con éxito');
            return true;
        } catch (error) {
            console.error('Error de conexión a la base de datos:', error.message);
            return false;
        } finally {
            connection?.release();
        }
    }

    static async disconnect() {
        if (Database.#pool) {
            await Database.#pool.end();
            Database.#pool = null;
        }
    }
}

export const pool = Database.getPool();
export const conectionDatabase = Database.connect;
export default Database;
