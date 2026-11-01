import Logger from '../utils/logger.util.js';
import AppError from '../utils/appError.util.js';

export default class ErrorMiddleware {
    static handleError(err, req, res, _next) {
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

        const message = statusCode >= 500 ? 'Error interno del servidor' : err.message;
        const errors = statusCode >= 500 ? null : err.details || null;

        res.status(statusCode).json({
            status,
            message,
            errors,
            mensaje: message,
            errores: errors
        });
    }

    static handleNotFound(req, _res, next) {
        return next(AppError.notFound('Ruta no encontrada.', {
            method: req.method,
            url: req.originalUrl
        }));
    }
}
