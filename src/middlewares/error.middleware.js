export function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const status = err.status || (statusCode >= 500 ? 'Error' : 'Fail');

    if (statusCode === 500) {
        console.error('[ERROR INTERNO NO CONTROLADO]:', err);
    }

    res.status(statusCode).json({
        status,
        mensaje: err.message || 'Error interno del servidor',
        errores: err.details || null
    });
}

export function rutaNoEncontrada(req, res) {
    res.status(404).json({
        status: 'Fail',
        mensaje: 'Ruta no encontrada',
        metodo: req.method,
        url: req.originalUrl
    });
}
