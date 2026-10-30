import { Router } from 'express';
import { pool } from '../config/db.config.js';
import MovieActorModel from '../models/movie-actor.model.js';
import MovieActorService from '../services/movie-actor.service.js';
import MovieActorController from '../controllers/movie-actor.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';
import { movieActorIdParamValidator, createMovieActorValidator, updateMovieActorValidator, movieIdParamValidator, actorIdParamValidator } from '../validators/movie-actor.validator.js';

const movieActorModel = new MovieActorModel(pool);
const movieActorService = new MovieActorService(movieActorModel);
const movieActorController = new MovieActorController(movieActorService);
const authMiddleware = new AuthMiddleware();

const movieActorRouter = Router();

// Rutas públicas
/**
 * @swagger
 * /movie-actors:
 *   get:
 *     tags: [Movie Actors]
 *     summary: Listar relaciones entre películas y actores
 *     parameters:
 *       - in: query
 *         name: movie_id
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: actor_id
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de relaciones película-actor.
 */
movieActorRouter.get('/', movieActorController.getAll);

/**
 * @swagger
 * /movie-actors/{id}:
 *   get:
 *     tags: [Movie Actors]
 *     summary: Obtener una relación película-actor por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Relación encontrada.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
movieActorRouter.get('/:id', movieActorIdParamValidator, validationMiddleware, movieActorController.getById);

/**
 * @swagger
 * /movie-actors/movie/{movieId}:
 *   get:
 *     tags: [Movie Actors]
 *     summary: Listar actores de una película
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Actores asociados a la película.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
movieActorRouter.get('/movie/:movieId', movieIdParamValidator, validationMiddleware, movieActorController.getByMovieId);

/**
 * @swagger
 * /movie-actors/actor/{actorId}:
 *   get:
 *     tags: [Movie Actors]
 *     summary: Listar películas de un actor
 *     parameters:
 *       - in: path
 *         name: actorId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Películas asociadas al actor.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
movieActorRouter.get('/actor/:actorId', actorIdParamValidator, validationMiddleware, movieActorController.getByActorId);

// Rutas protegidas (solo administradores)
/**
 * @swagger
 * /movie-actors:
 *   post:
 *     tags: [Movie Actors]
 *     summary: Asociar un actor a una película
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [movie_id, actor_id]
 *             properties:
 *               movie_id:
 *                 type: integer
 *                 minimum: 1
 *               actor_id:
 *                 type: integer
 *                 minimum: 1
 *               character_name:
 *                 type: string
 *                 maxLength: 100
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Actor asociado a la película.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
movieActorRouter.post('/', authMiddleware.requireAuth, authMiddleware.requireAdmin, createMovieActorValidator, validationMiddleware, movieActorController.create);

/**
 * @swagger
 * /movie-actors/{id}:
 *   put:
 *     tags: [Movie Actors]
 *     summary: Actualizar una relación película-actor
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
 *               movie_id:
 *                 type: integer
 *                 minimum: 1
 *               actor_id:
 *                 type: integer
 *                 minimum: 1
 *               character_name:
 *                 type: string
 *                 maxLength: 100
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Relación actualizada.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
movieActorRouter.put('/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, updateMovieActorValidator, validationMiddleware, movieActorController.update);

/**
 * @swagger
 * /movie-actors/{id}:
 *   delete:
 *     tags: [Movie Actors]
 *     summary: Eliminar una relación película-actor
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
 *         description: Relación eliminada.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
movieActorRouter.delete('/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, movieActorIdParamValidator, validationMiddleware, movieActorController.delete);

export default movieActorRouter;
