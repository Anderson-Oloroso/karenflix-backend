import { Router } from 'express';
import { pool } from '../config/db.config.js';
import MovieModel from '../models/movie.model.js';
import MovieService from '../services/movie.service.js';
import MovieController from '../controllers/movie.controller.js';

import createMovieValidator from '../validators/movie.create.validator.js';
import updateMovieValidator from '../validators/movie.update.validator.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { movieIdParamValidator } from '../validators/movie.update.validator.js';

// Ensamblaje
const movieModel = new MovieModel(pool);
const movieService = new MovieService(movieModel);
const movieController = new MovieController(movieService);
const authMiddleware = new AuthMiddleware();

const router = Router();

/**
 * @swagger
 * /movies:
 *   get:
 *     tags: [Movies]
 *     summary: Listar películas
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filtra por ID de categoría.
 *       - in: query
 *         name: title
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtra por título.
 *     responses:
 *       200:
 *         description: Lista de películas.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.get('/', movieController.getAll);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     tags: [Movies]
 *     summary: Obtener una película por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Película encontrada.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', movieIdParamValidator, validationMiddleware, movieController.getById);

/**
 * @swagger
 * /movies:
 *   post:
 *     tags: [Movies]
 *     summary: Crear una película pendiente de aprobación
 *     description: Disponible para cualquier usuario autenticado; la película se crea con estado pending.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, category_id, release_year]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 150
 *               description:
 *                 type: string
 *                 minLength: 10
 *               category_id:
 *                 type: integer
 *                 minimum: 1
 *               release_year:
 *                 type: integer
 *                 minimum: 1900
 *               image_url:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Película creada.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/', authMiddleware.requireAuth, createMovieValidator, validationMiddleware, movieController.create);

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     tags: [Movies]
 *     summary: Actualizar una película
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 150
 *               description:
 *                 type: string
 *                 minLength: 10
 *               category_id:
 *                 type: integer
 *                 minimum: 1
 *               release_year:
 *                 type: integer
 *                 minimum: 1900
 *               image_url:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *               status:
 *                 type: string
 *                 enum: [pending, approved]
 *     responses:
 *       200:
 *         description: Película actualizada.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, updateMovieValidator, validationMiddleware, movieController.update);

/**
 * @swagger
 * /movies/{id}/approve:
 *   patch:
 *     tags: [Movies]
 *     summary: Aprobar una película
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
 *         description: Película aprobada.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:id/approve', authMiddleware.requireAuth, authMiddleware.requireAdmin, movieIdParamValidator, validationMiddleware, movieController.approve);

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     tags: [Movies]
 *     summary: Eliminar una película
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
 *         description: Película eliminada.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, movieIdParamValidator, validationMiddleware, movieController.delete);

export default router;
