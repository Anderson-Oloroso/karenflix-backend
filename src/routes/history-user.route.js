import { Router } from 'express';
import Database from '../config/db.config.js';
import HistoryUserModel from '../models/history-user.model.js';
import HistoryUserService from '../services/history-user.service.js';
import HistoryUserController from '../controllers/history-users.controller.js';

const historyUserModel = new HistoryUserModel(Database.getPool());
const historyUserService = new HistoryUserService(historyUserModel);
const historyUserController = new HistoryUserController(historyUserService);

const historyUserRouter = Router();

historyUserRouter.get('/:id', historyUserController.getUserHistory);

export default historyUserRouter;
