import { Router } from 'express';
import Database from '../config/db.config.js';
import MovieModel from '../models/movie.model.js';
import MovieService from '../services/movie.service.js';
import MovieController from '../controllers/movie.controller.js';

import createMovieValidator from '../validators/movie.create.validator.js';
import updateMovieValidator from '../validators/movie.update.validator.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { movieIdParamValidator } from '../validators/movie.update.validator.js';
import movieQueryValidator from '../validators/movie.query.validator.js';

const pool = Database.getPool();
const movieModel = new MovieModel(pool);
const movieService = new MovieService(movieModel);
const movieController = new MovieController(movieService);
const authMiddleware = new AuthMiddleware();

const router = Router();

router.get('/pending', authMiddleware.requireAuth, authMiddleware.requireAdmin, movieQueryValidator, validationMiddleware, movieController.getPending);

router.get('/', movieQueryValidator, validationMiddleware, movieController.getAll);
router.get('/:id', movieIdParamValidator, validationMiddleware, movieController.getById);

router.post('/', authMiddleware.requireAuth, createMovieValidator, validationMiddleware, movieController.create);

router.put('/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, updateMovieValidator, validationMiddleware, movieController.update);

router.patch('/:id/approve', authMiddleware.requireAuth, authMiddleware.requireAdmin, movieIdParamValidator, validationMiddleware, movieController.approve);

router.delete('/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, movieIdParamValidator, validationMiddleware, movieController.delete);

export default router;
