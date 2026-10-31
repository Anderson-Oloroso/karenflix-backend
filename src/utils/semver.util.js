import { API_VERSION } from '../config/api.config.js';

export default class SemverMiddleware {
    static handle(req, res, next) {
        res.setHeader('X-API-Version', API_VERSION);
        next();
    }
}
