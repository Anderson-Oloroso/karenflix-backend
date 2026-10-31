import { Router } from 'express';
import Database from '../config/db.config.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';
import ReviewReactionModel from '../models/review-reaction.model.js';
import ReviewReactionService from '../services/review-reaction.service.js';
import ReviewReactionController from '../controllers/review-reaction.controller.js';
import reviewReactionValidator from '../validators/review-reaction.validator.js';

const pool = Database.getPool();
const reviewReactionModel = new ReviewReactionModel(pool);
const reviewReactionService = new ReviewReactionService(reviewReactionModel, pool);
const reviewReactionController = new ReviewReactionController(reviewReactionService);
const authMiddleware = new AuthMiddleware();

const router = Router();

router.post('/:id/reactions', authMiddleware.requireAuth, reviewReactionValidator, validationMiddleware, reviewReactionController.toggle);

export default router;
