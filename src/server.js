import 'dotenv/config';
import app from './app.js';
import Database from './config/db.config.js';

export class Server {
    #port;
    #app;

    constructor(port = Number(process.env.PORT) || 4000, appInstance = app) {
        this.#port = port;
        this.#app = appInstance;
    }

    async start() {
        try {
            const databaseConnected = await Database.connect();

            if (!databaseConnected) {
                console.error('No fue posible conectarse a la base de datos');
                process.exit(1);
            }

            this.#app.listen(this.#port, () => {
                console.log(`servidor ejecutandose en el puerto: ${this.#port}`);
                console.log(`modo: ${process.env.NODE_ENV}`);
                console.log(`API: http://localhost:${this.#port}${process.env.API_PREFIX || '/api/v1'}`);
            });
        } catch (error) {
            console.error('Error al iniciar el servidor:', error.message);
            process.exit(1);
        }
    }
}

const server = new Server();
server.start();
