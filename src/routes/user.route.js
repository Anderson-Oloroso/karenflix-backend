import { Router } from 'express';
import Database from '../config/db.config.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';
import UserModel from '../models/user.model.js';
import UserService from '../services/user.service.js';
import UserController from '../controllers/user.controller.js';
import {
	updateAccountValidator,
	updateUserRoleValidator,
	userIdParamValidator
} from '../validators/user.validator.js';

const userModel = new UserModel(Database.getPool());
const userService = new UserService(userModel);
const userController = new UserController(userService);
const authMiddleware = new AuthMiddleware();
const userRouter = Router();
export const userProfileRouter = Router();

userProfileRouter.use(authMiddleware.requireAuth);

userProfileRouter.get('/', userController.getProfile);

userProfileRouter.put('/', updateAccountValidator, validationMiddleware, userController.updateProfile);

userProfileRouter.delete('/', userController.deleteProfile);

userRouter.use(authMiddleware.requireAuth, authMiddleware.requireAdmin);

userRouter.get('/', userController.getAll);

userRouter.put('/:id', userIdParamValidator, updateAccountValidator, validationMiddleware, userController.update);

userRouter.patch('/:id/role', updateUserRoleValidator, validationMiddleware, userController.updateRole);

userRouter.delete('/:id', userIdParamValidator, validationMiddleware, userController.delete);

export default userRouter;
