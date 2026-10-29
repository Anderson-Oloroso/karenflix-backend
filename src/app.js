import express from 'express';
import apiRoutes from './routes/index.js';
import RateLimitMiddleware from './middlewares/rateLimit.middleware.js';
import ErrorMiddleware from './middlewares/error.middleware.js';

export class App {
    #app;

    constructor() {
        this.#app = express();
        this.#initMiddlewares();
        this.#initRoutes();
        this.#initErrorHandling();
    }

    get app() {
        return this.#app;
    }

    #initMiddlewares() {
        this.#app.use(RateLimitMiddleware.globalLimiter);
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({ extended: true }));
    }

    #initRoutes() {
        this.#app.get('/api/v1', (req, res) => {
            res.status(200).json({
                status: 'success',
                message: 'karenflix API funcionando correctamente...'
            });
        });

        this.#app.use('/api/v1', apiRoutes);
    }

    #initErrorHandling() {
        this.#app.use(ErrorMiddleware.handleNotFound);
        this.#app.use(ErrorMiddleware.handleError);
    }
}

const appInstance = new App();
export default appInstance.app;
