import { Router } from 'express';
import { pool } from '../config/db.config.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import ReviewModel from '../models/review.model.js';
import ReviewService from '../services/review.service.js';
import ReviewController from '../controllers/review.controller.js';
import { createReviewValidator, reviewMovieIdParamValidator } from '../validators/review.validator.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';

const reviewModel = new ReviewModel(pool);
const reviewService = new ReviewService(reviewModel);
const reviewController = new ReviewController(reviewService);
const auth = new AuthMiddleware();

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /movies/{id}/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Listar reseñas de una película
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la película.
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Lista de reseñas de la película.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/', reviewMovieIdParamValidator, validationMiddleware, reviewController.getByMovieId);

/**
 * @swagger
 * /movies/{id}/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Crear una reseña para una película
 *     description: La creación se procesa mediante el servicio transaccional de reseñas.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la película.
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating, title, comment]
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               comment:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *     responses:
 *       201:
 *         description: Reseña creada correctamente.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
router.post('/', auth.requireAuth, createReviewValidator, validationMiddleware, reviewController.create);

export default router;
