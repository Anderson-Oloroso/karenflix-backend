import Logger from '../utils/logger.util.js';

export default class LoggerMiddleware {
    static handle(req, res, next) {
        const startTime = Date.now();

        res.on('finish', () => {
            const statusCode = res.statusCode;
            const route = req.route
                ? `${req.baseUrl}${req.route.path}`
                : req.path;
            const entry = {
                timestamp: new Date().toISOString(),
                method: req.method,
                user: req.user?.username ?? 'anonymous',
                route,
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
