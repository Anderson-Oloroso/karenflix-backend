import express from 'express';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes/index.js';
import { errorHandler, rutaNoEncontrada } from './middlewares/error.middleware.js';

const app = express();

const limiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
    message: {
        status: 'error',
        message: 'Demasiadas peticiones, intenta más tarde...'
    }
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/v1', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'karenflix API funcionando correctamente...'
    });
});

// Rutas principales
app.use('/api/v1', apiRoutes);

// Manejo de rutas inexistentes y errores
app.use(rutaNoEncontrada);
app.use(errorHandler);

export default app;
