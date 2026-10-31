export default class CorsMiddleware {
    static handle(req, res, next) {
        const origin = req.headers.origin;
        const configuredOrigins = process.env.CORS_ORIGIN || 'http://localhost:5500,http://127.0.0.1:5500,http://localhost:5173,http://localhost:3000';
        const allowedOrigins = configuredOrigins.split(',').map(o => o.trim());

        if (origin && (allowedOrigins.includes(origin) || allowedOrigins.includes('*'))) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        } else if (!origin) {
            res.setHeader('Access-Control-Allow-Origin', '*');
        }

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
        res.setHeader('Access-Control-Expose-Headers', 'X-API-Version');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        if (req.method === 'OPTIONS') {
            return res.sendStatus(204);
        }

        next();
    }
}
