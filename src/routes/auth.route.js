import { Router } from "express";
import { validationsRegister, validationsLogin } from "../validators/auth.validator.js";

import { pool } from "../config/db.config.js";
import UserModel from "../models/user.model.js";
import AuthService from "../services/auth.service.js";
import AuthController from "../controllers/auth.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";

// Ensamblaje
const userModel = new UserModel(pool);
const authService = new AuthService(userModel);
const authController = new AuthController(authService);
const authMiddleware = new AuthMiddleware();

const authRouter = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar una cuenta de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [user]
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
authRouter.post('/register', validationsRegister, authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión
 *     description: Envía exactamente uno de los campos email o username junto con la contraseña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso; devuelve el JWT en data.jwt.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
authRouter.post('/login', validationsLogin, authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Cerrar sesión
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
authRouter.post('/logout', authMiddleware.requireAuth, authController.logout);

export default authRouter;
