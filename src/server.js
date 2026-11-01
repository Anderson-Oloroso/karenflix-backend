import 'dotenv/config';
import app from './app.js';
import Database from './config/db.config.js';
import { API_PREFIX } from './config/api.config.js';

export class Server {
    #port;
    #app;

    constructor(port = Number(process.env.PORT) || 4000, appInstance = app) {
        this.#port = port;
        this.#app = appInstance;
    }

    async start() {
        try {
            await Database.connect();

            this.#app.listen(this.#port, () => {
                console.log(`servidor ejecutandose en el puerto: ${this.#port}`);
                console.log(`modo: ${process.env.NODE_ENV}`);
                const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${this.#port}`;
                console.log(`API: ${baseUrl}${API_PREFIX}`);
            });
        } catch (error) {
            console.error('Error al iniciar el servidor:', error.message);
            process.exit(1);
        }
    }
}

const server = new Server();
server.start();
