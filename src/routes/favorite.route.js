import { Router } from 'express';
import { pool } from '../config/db.config.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';
import FavoriteModel from '../models/favorite.model.js';
import FavoriteService from '../services/favorite.service.js';
import FavoriteController from '../controllers/favorite.controller.js';
import {
    createFavoriteValidator,
    favoriteIdParamValidator
} from '../validators/favorite.validator.js';

const favoriteModel = new FavoriteModel(pool);
const favoriteService = new FavoriteService(favoriteModel);
const favoriteController = new FavoriteController(favoriteService);
const authMiddleware = new AuthMiddleware();

const favoriteRouter = Router();

favoriteRouter.use(authMiddleware.requireAuth);

/**
 * @swagger
 * /favorites:
 *   get:
 *     tags: [Favorites]
 *     summary: Listar los favoritos del usuario autenticado
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de favoritos.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
favoriteRouter.get('/', favoriteController.getAll);

/**
 * @swagger
 * /favorites:
 *   post:
 *     tags: [Favorites]
 *     summary: Agregar una película a favoritos
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [movie_id]
 *             properties:
 *               movie_id:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Película agregada a favoritos.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
favoriteRouter.post('/', createFavoriteValidator, validationMiddleware, favoriteController.create);

/**
 * @swagger
 * /favorites/{id}:
 *   delete:
 *     tags: [Favorites]
 *     summary: Eliminar un favorito del usuario autenticado
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Favorito eliminado.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
favoriteRouter.delete('/:id', favoriteIdParamValidator, validationMiddleware, favoriteController.delete);

export default favoriteRouter;