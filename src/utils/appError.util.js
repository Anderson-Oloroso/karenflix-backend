export default class AppError extends Error {
    constructor(message, statusCode = 500, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error';
        this.details = details;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message, details = null) {
        return new AppError(message, 400, details);
    }

    static unauthorized(message = 'No autorizado') {
        return new AppError(message, 401);
    }

    static forbidden(message = 'Acceso denegado') {
        return new AppError(message, 403);
    }

    static notFound(message = 'Recurso no encontrado') {
        return new AppError(message, 404);
    }

    static conflict(message = 'El recurso ya existe o entra en conflicto') {
        return new AppError(message, 409);
    }

    static internal(message = 'Error interno del servidor') {
        return new AppError(message, 500);
    }
}
