import { Router } from 'express';
import Database from '../config/db.config.js';
import DirectorModel from '../models/director.model.js';
import DirectorService from '../services/director.service.js';
import DirectorController from '../controllers/director.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';
import {
    createDirectorValidator,
    directorIdParamValidator,
    directorQueryValidator,
    updateDirectorValidator
} from '../validators/director.validator.js';

const directorModel = new DirectorModel(Database.getPool());
const directorService = new DirectorService(directorModel);
const directorController = new DirectorController(directorService);
const authMiddleware = new AuthMiddleware();
const directorRouter = Router();

directorRouter.get('/', directorController.getAll);
directorRouter.get(
    '/:id',
    [...directorIdParamValidator, ...directorQueryValidator],
    validationMiddleware,
    directorController.getById
);
directorRouter.post(
    '/',
    authMiddleware.requireAuth,
    authMiddleware.requireAdmin,
    createDirectorValidator,
    validationMiddleware,
    directorController.create
);
directorRouter.put(
    '/:id',
    authMiddleware.requireAuth,
    authMiddleware.requireAdmin,
    updateDirectorValidator,
    validationMiddleware,
    directorController.update
);
directorRouter.delete(
    '/:id',
    authMiddleware.requireAuth,
    authMiddleware.requireAdmin,
    directorIdParamValidator,
    validationMiddleware,
    directorController.delete
);

export default directorRouter;
