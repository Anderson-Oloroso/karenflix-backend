import { createPool } from 'mysql2/promise';
import 'dotenv/config';

export const pool = createPool({
    host: process.env.DB_HOST,
    user:process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    queueLimit: 0
});

export async function conectionDatabase() {
    let connection;
    
    try {
        connection = await pool.getConnection();

        console.log(`Base de datos conectada con exitos`);


        return true;
    } catch (error) {
        console.error(`Error de conexión ... `, error.message);
        return false;
    }finally{
        connection?.release();
    }
}