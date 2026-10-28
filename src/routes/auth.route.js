import { Router } from "express";
import { validationsRegister, validationsLogin } from "../validators/auth.validator.js";

import { pool } from "../config/db.config.js";
import UserModel from "../models/user.model.js";
import AuthService from "../services/auth.service.js";
import AuthController from "../controllers/auth.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";

// Ensamblaje con inyección de dependencias (100% POO)
const userModel = new UserModel(pool);
const authService = new AuthService(userModel);
const authController = new AuthController(authService);
const authMiddleware = new AuthMiddleware();

const authRouter = Router();

authRouter.post('/register', validationsRegister, authController.register);
authRouter.post('/login', validationsLogin, authController.login);
authRouter.post('/logout', authMiddleware.requireAuth, authController.logout);
authRouter.get('/profile', authMiddleware.requireAuth, authController.profile);

export default authRouter;
