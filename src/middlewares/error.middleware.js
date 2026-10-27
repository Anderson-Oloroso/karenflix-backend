export function errorHandler(err, req, res, next) {
    res.status(err.statusCode || 500).json({
        status: 'Fail',
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
