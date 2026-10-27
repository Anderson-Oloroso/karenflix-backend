import 'dotenv/config';
import app from './app.js';
import { conectionDatabase } from './config/db.config.js';

const PORT = Number(process.env.PORT);

async function startServer() {
    try {
        const databaseConnection = await conectionDatabase();

        if(!databaseConnection) {
            console.error(`no fue posible conectarse a la base de datos`);
            process.exit(1);
        }

        app.listen(PORT, () =>{
            console.log(`servidor ejecutandose en el puerto: ${PORT}`);
            console.log(`modo: ${process.env.NODE_ENV}`);
            console.log(`API: http://localhost:${PORT}${process.env.API_PREFIX}`);
        } );
    } catch (error) {
        console.error('Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
}

startServer();
