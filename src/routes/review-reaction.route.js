import { Router } from 'express';
import { pool } from '../config/db.config.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';
import ReviewReactionModel from '../models/review-reaction.model.js';
import ReviewReactionService from '../services/review-reaction.service.js';
import ReviewReactionController from '../controllers/review-reaction.controller.js';
import reviewReactionValidator from '../validators/review-reaction.validator.js';

const reviewReactionModel = new ReviewReactionModel(pool);
const reviewReactionService = new ReviewReactionService(reviewReactionModel, pool);
const reviewReactionController = new ReviewReactionController(reviewReactionService);
const authMiddleware = new AuthMiddleware();

const router = Router();

/**
 * @swagger
 * /reviews/{id}/reactions:
 *   post:
 *     tags: [Reactions]
 *     summary: Alternar reacción like/dislike en una reseña
 *     description: Si se envía la reacción ya registrada por el usuario, se elimina.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la reseña.
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reaction_type]
 *             properties:
 *               reaction_type:
 *                 type: string
 *                 enum: [like, dislike]
 *     responses:
 *       200:
 *         description: Reacción creada, actualizada o eliminada.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/:id/reactions', authMiddleware.requireAuth, reviewReactionValidator, validationMiddleware, reviewReactionController.toggle);

export default router;
