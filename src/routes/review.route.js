import { Router } from 'express';
import { pool } from '../config/db.config.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import ReviewModel from '../models/review.model.js';
import ReviewService from '../services/review.service.js';
import ReviewController from '../controllers/review.controller.js';
import { createReviewValidator, reviewMovieIdParamValidator } from '../validators/review.validator.js';
import validationMiddleware from '../middlewares/validation.middleware.js';

const reviewModel = new ReviewModel(pool);
const reviewService = new ReviewService(reviewModel, pool);
const reviewController = new ReviewController(reviewService);
const auth = new AuthMiddleware();

const router = Router({ mergeParams: true });

router.get('/', reviewMovieIdParamValidator, validationMiddleware, reviewController.getByMovieId);
router.post('/', auth.requireAuth, createReviewValidator, validationMiddleware, reviewController.create);

export default router;
