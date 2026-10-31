import express from 'express';
import apiRoutes from './routes/index.js';
import RateLimitMiddleware from './middlewares/rateLimit.middleware.js';
import ErrorMiddleware from './middlewares/error.middleware.js';
import CorsMiddleware from './middlewares/cors.middleware.js';
import SemverMiddleware from './utils/semver.util.js';
import LoggerMiddleware from './middlewares/logger.middleware.js';
import { swaggerDocs } from './config/swagger.config.js';
import { API_PREFIX } from './config/api.config.js';

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
        this.#app.use(LoggerMiddleware.handle);
        this.#app.use(SemverMiddleware.handle);
        this.#app.use(CorsMiddleware.handle);
        this.#app.use(RateLimitMiddleware.globalLimiter);
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({ extended: true }));
    }

    #initRoutes() {
        swaggerDocs(this.#app);

        this.#app.get(API_PREFIX, (req, res) => {
            res.status(200).json({
                status: 'success',
                message: 'karenflix API funcionando correctamente...'
            });
        });

        this.#app.use(API_PREFIX, apiRoutes);
    }

    #initErrorHandling() {
        this.#app.use(ErrorMiddleware.handleNotFound);
        this.#app.use(ErrorMiddleware.handleError);
    }
}

const appInstance = new App();
export default appInstance.app;
