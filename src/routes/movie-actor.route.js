import { Router } from 'express';
import { pool } from '../config/db.config.js';
import MovieActorModel from '../models/movie-actor.model.js';
import MovieActorService from '../services/movie-actor.service.js';
import MovieActorController from '../controllers/movie-actor.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import validationMiddleware from '../middlewares/validation.middleware.js';
import {
    movieActorIdParamValidator,
    createMovieActorValidator,
    updateMovieActorValidator,
    movieIdParamValidator,
    actorIdParamValidator
} from '../validators/movie-actor.validator.js';

const movieActorModel = new MovieActorModel(pool);
const movieActorService = new MovieActorService(movieActorModel);
const movieActorController = new MovieActorController(movieActorService);
const authMiddleware = new AuthMiddleware();

const movieActorRouter = Router();

// Rutas públicas
movieActorRouter.get('/', movieActorController.getAll);
movieActorRouter.get('/:id', movieActorIdParamValidator, validationMiddleware, movieActorController.getById);
movieActorRouter.get('/movie/:movieId', movieIdParamValidator, validationMiddleware, movieActorController.getByMovieId);
movieActorRouter.get('/actor/:actorId', actorIdParamValidator, validationMiddleware, movieActorController.getByActorId);

// Rutas protegidas (solo administradores)
movieActorRouter.post('/', authMiddleware.requireAuth, authMiddleware.requireAdmin, createMovieActorValidator, validationMiddleware, movieActorController.create);
movieActorRouter.put('/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, updateMovieActorValidator, validationMiddleware, movieActorController.update);
movieActorRouter.delete('/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, movieActorIdParamValidator, validationMiddleware, movieActorController.delete);

export default movieActorRouter;
