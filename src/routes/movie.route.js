import { Router } from 'express';
import MoviesController from '../controllers/movie.controller.js';
import createMovieValidator from '../validators/movie.create.validator.js'
import updateMovieValidator from '../validators/movie.update.validator.js';
import validationMiddleware from '../middlewares/validation.middleware.js';

const router = Router();

// GET 

router.get('/', MoviesController.getAll);

router.get('/:id', MoviesController.getById);

// POST

router.post(
    '/',
    createMovieValidator,
    validationMiddleware,
    MoviesController.create
);

// PUT

router.put(
    '/:id',
    updateMovieValidator,
    validationMiddleware,
    MoviesController.update
);

// PATCH

router.patch('/:id/approve', MoviesController.approve);

// DELETE

router.delete('/:id', MoviesController.delete);

export default router;