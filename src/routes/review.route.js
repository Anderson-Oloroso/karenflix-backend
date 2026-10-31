import { Router } from 'express';
import Database from '../config/db.config.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import ReviewModel from '../models/review.model.js';
import ReviewService from '../services/review.service.js';
import ReviewController from '../controllers/review.controller.js';
import {
    createReviewValidator,
    reviewMovieIdParamValidator,
    updateReviewValidator,
    reviewIdParamValidator
} from '../validators/review.validator.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';

const pool = Database.getPool();
const reviewModel = new ReviewModel(pool);
const reviewService = new ReviewService(reviewModel, pool);
const reviewController = new ReviewController(reviewService);
const auth = new AuthMiddleware();

const router = Router({ mergeParams: true });

router.get('/', reviewMovieIdParamValidator, validationMiddleware, reviewController.getByMovieId);

router.post('/', auth.requireAuth, createReviewValidator, validationMiddleware, reviewController.create);

router.put('/:reviewId', auth.requireAuth, updateReviewValidator, validationMiddleware, reviewController.update);

router.delete('/:reviewId', auth.requireAuth, reviewIdParamValidator, validationMiddleware, reviewController.delete);

export default router;
