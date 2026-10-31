import { Router } from 'express';
import { validationsRegister, validationsLogin } from '../validators/auth.validator.js';
import Database from '../config/db.config.js';
import UserModel from '../models/user.model.js';
import AuthService from '../services/auth.service.js';
import AuthController from '../controllers/auth.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import RateLimitMiddleware from '../middlewares/rateLimit.middleware.js';

const pool = Database.getPool();
const userModel = new UserModel(pool);
const authService = new AuthService(userModel);
const authController = new AuthController(authService);
const authMiddleware = new AuthMiddleware();
const authLimiter = RateLimitMiddleware.authLimiter;

const authRouter = Router();

authRouter.post('/register', authLimiter, validationsRegister, authController.register);

authRouter.post('/login', authLimiter, validationsLogin, authController.login);

authRouter.post('/logout', authMiddleware.requireAuth, authController.logout);

export default authRouter;
