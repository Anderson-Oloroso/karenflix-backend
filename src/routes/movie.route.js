import { Router } from 'express';
import { pool } from '../config/db.config.js';
import MovieModel from '../models/movie.model.js';
import MovieService from '../services/movie.service.js';
import MovieController from '../controllers/movie.controller.js';

import createMovieValidator from '../validators/movie.create.validator.js';
import updateMovieValidator from '../validators/movie.update.validator.js';
import validationMiddleware from '../middlewares/validation.middleware.js';

// Ensamblaje
const movieModel = new MovieModel(pool);
const movieService = new MovieService(movieModel);
const movieController = new MovieController(movieService);

const router = Router();

router.get('/', movieController.getAll);
router.get('/:id', movieController.getById);
router.post('/', createMovieValidator, validationMiddleware, movieController.create);
router.put('/:id', updateMovieValidator, validationMiddleware, movieController.update);
router.patch('/:id/approve', movieController.approve);
router.delete('/:id', movieController.delete);

export default router;
