import Logger from '../utils/logger.util.js';

export default class ErrorMiddleware {
    static handleError(err, req, res, next) {
        const statusCode = err.statusCode || 500;
        const status = err.status || (statusCode >= 500 ? 'Error' : 'Fail');

        if (statusCode >= 500) {
            const message = err.message || 'Error interno del servidor';
            const stack = err.stack || new Error(message).stack;

            Logger.error({
                timestamp: new Date().toISOString(),
                method: req.method,
                route: req.path,
                statusCode,
                message,
                stack
            });
        }

        res.status(statusCode).json({
            status,
            mensaje: err.message || 'Error interno del servidor',
            errores: err.details || null
        });
    }

    static handleNotFound(req, res) {
        res.status(404).json({
            status: 'Fail',
            mensaje: 'Ruta no encontrada',
            metodo: req.method,
            url: req.originalUrl
        });
    }
}

export const errorHandler = ErrorMiddleware.handleError;
export const rutaNoEncontrada = ErrorMiddleware.handleNotFound;
