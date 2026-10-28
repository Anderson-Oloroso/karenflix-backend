import { Router } from 'express';
import { pool } from '../config/db.config.js';
import MovieModel from '../models/movie.model.js';
import MovieService from '../services/movie.service.js';
import MovieController from '../controllers/movie.controller.js';

import createMovieValidator from '../validators/movie.create.validator.js';
import updateMovieValidator from '../validators/movie.update.validator.js';
import validationMiddleware from '../middlewares/validation.middleware.js';

// Ensamblaje con inyección de dependencias (100% POO)
const movieModel      = new MovieModel(pool);
const movieService    = new MovieService(movieModel);
const movieController = new MovieController(movieService);

const router = Router();

// GET 
router.get('/', movieController.getAll);
router.get('/:id', movieController.getById);

// POST
router.post(
    '/',
    createMovieValidator,
    validationMiddleware,
    movieController.create
);

// PUT
router.put(
    '/:id',
    updateMovieValidator,
    validationMiddleware,
    movieController.update
);

// PATCH
router.patch('/:id/approve', movieController.approve);

// DELETE
router.delete('/:id', movieController.delete);

export default router;
