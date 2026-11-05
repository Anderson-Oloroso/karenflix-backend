import { Router } from 'express';
import Database from '../config/db.config.js';
import HistoryUserModel from '../models/history-user.model.js';
import HistoryUserService from '../services/history-user.service.js';
import HistoryUserController from '../controllers/history-users.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { userIdParamValidator } from '../validators/user.validator.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';

const historyUserModel = new HistoryUserModel(Database.getPool());
const historyUserService = new HistoryUserService(historyUserModel);
const historyUserController = new HistoryUserController(historyUserService);
const authMiddleware = new AuthMiddleware();

const historyUserRouter = Router();

historyUserRouter.get( '/:id', authMiddleware.requireAuth, userIdParamValidator, validationMiddleware, historyUserController.getUserHistory );

export default historyUserRouter;
