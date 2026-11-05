import Logger from '../utils/logger.util.js';
import HistoryUserModel from '../models/history-user.model.js';
import Database from '../config/db.config.js';
import HistoryUserController from '../controllers/history-users.controller.js';
import HistoryUserService from '../services/history-user.service.js';

export default class LoggerMiddleware {
    static async handle(req, res, next) {
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
    
        const historyUserModel = new HistoryUserModel(Database.getPool());
        const historyUserService = new HistoryUserService(historyUserModel);
        const historyUserController = new HistoryUserController(historyUserService);

        await historyUserController.createHistory(req, res, next);

        next();
    }
}
