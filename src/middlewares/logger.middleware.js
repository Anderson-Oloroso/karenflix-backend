import Logger from '../utils/logger.util.js';

export default class LoggerMiddleware {
    static handle(req, res, next) {
        const startTime = Date.now();

        res.on('finish', () => {
            const statusCode = res.statusCode;
            const route = req.originalUrl.split('?')[0];
            const isPreflight = req.method === 'OPTIONS';
            const entry = {
                timestamp: new Date().toISOString(),
                method: isPreflight
                    ? req.get('access-control-request-method') ?? req.method
                    : req.method,
                isPreflight,
                user: req.user?.username ?? 'anonymous',
                userId: req.user?.id ?? req.user?.sub ?? 'anonymous',
                route,
                origin: req.get('origin') ?? 'none',
                allowedOrigin: res.getHeader('Access-Control-Allow-Origin') ?? 'none',
                statusCode,
                responseTimeMs: Date.now() - startTime
            };

            if (statusCode >= 500) {
                Logger.error(entry);
                return;
            }

            Logger.info(entry);
        });

        next();
    }
}
