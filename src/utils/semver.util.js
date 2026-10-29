export const API_VERSION = '1.0.0';

export default class SemverMiddleware {
    static handle(req, res, next) {
        res.setHeader('X-API-Version', API_VERSION);
        next();
    }
}
