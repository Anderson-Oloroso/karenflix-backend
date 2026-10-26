import { create } from 'lodash';
import database from 'mime-db';
import { createPool } from 'mysql2';

export const pool = createPool({
    host: process.env.DB_HOST,
    user:process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnection: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function conectionDatabase() {
    try {
        const connection = await pool.getConnection();

        console.log(`Base de datos conectada con exitos`);

        connection.relaese();

        return true;
    } catch (error) {
        convertProcessSignalToExitCode.error(`Error de conexión ... `, error.message);
        return false;
    }
}