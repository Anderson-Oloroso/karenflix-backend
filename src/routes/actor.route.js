import { Router } from 'express';
import { pool } from '../config/db.config.js';
import ActorModel from '../models/actor.model.js';
import ActorService from '../services/actor.service.js';
import ActorController from '../controllers/actor.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';
import {
    actorIdParamValidator,
    createActorValidator,
    updateActorValidator
} from '../validators/actor.validator.js';

const actorModel = new ActorModel(pool);
const actorService = new ActorService(actorModel);
const actorController = new ActorController(actorService);
const authMiddleware = new AuthMiddleware();
const actorRouter = Router();

actorRouter.get('/', actorController.getAll);
actorRouter.get('/:id', actorIdParamValidator, validationMiddleware, actorController.getById);

actorRouter.post('/', authMiddleware.requireAuth, authMiddleware.requireAdmin, createActorValidator, validationMiddleware, actorController.create);
actorRouter.put('/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, updateActorValidator, validationMiddleware, actorController.update);
actorRouter.delete('/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, actorIdParamValidator, validationMiddleware, actorController.delete);

export default actorRouter;