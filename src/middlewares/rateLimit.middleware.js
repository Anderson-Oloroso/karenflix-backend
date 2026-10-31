import rateLimit from 'express-rate-limit';

export default class RateLimitMiddleware {
    static createLimiter(options = {}) {
        return rateLimit({
            windowMs: Number(options.windowMs || process.env.RATE_LIMIT_WINDOW_MS || 900000),
            max: Number(options.max || process.env.RATE_LIMIT_MAX_REQUESTS || 100),
            message: {
                status: 'error',
                message: options.message || 'Demasiadas peticiones, intenta más tarde...'
            },
            ...options
        });
    }

    static get globalLimiter() {
        return RateLimitMiddleware.createLimiter();
    }

    static get authLimiter() {
        return RateLimitMiddleware.createLimiter({
            windowMs: 15 * 60 * 1000,
            max: 20,
            message: 'Demasiados intentos de autenticación, por favor intente nuevamente en 15 minutos.'
        });
    }
}
