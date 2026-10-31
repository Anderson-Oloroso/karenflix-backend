import { Router } from 'express';
import Database from '../config/db.config.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';
import FavoriteModel from '../models/favorite.model.js';
import FavoriteService from '../services/favorite.service.js';
import FavoriteController from '../controllers/favorite.controller.js';
import {
    createFavoriteValidator,
    favoriteIdParamValidator
} from '../validators/favorite.validator.js';

const favoriteModel = new FavoriteModel(Database.getPool());
const favoriteService = new FavoriteService(favoriteModel);
const favoriteController = new FavoriteController(favoriteService);
const authMiddleware = new AuthMiddleware();

const favoriteRouter = Router();

favoriteRouter.use(authMiddleware.requireAuth);

favoriteRouter.get('/', favoriteController.getAll);

favoriteRouter.post('/', createFavoriteValidator, validationMiddleware, favoriteController.create);

favoriteRouter.delete('/:id', favoriteIdParamValidator, validationMiddleware, favoriteController.delete);

export default favoriteRouter;