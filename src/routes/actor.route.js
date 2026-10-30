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

/**
 * @swagger
 * /actors:
 *   get:
 *     tags: [Actors]
 *     summary: Listar actores
 *     responses:
 *       200:
 *         description: Lista de actores.
 */
actorRouter.get('/', actorController.getAll);

/**
 * @swagger
 * /actors/{id}:
 *   get:
 *     tags: [Actors]
 *     summary: Obtener un actor por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Actor encontrado.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
actorRouter.get('/:id', actorIdParamValidator, validationMiddleware, actorController.getById);

/**
 * @swagger
 * /actors:
 *   post:
 *     tags: [Actors]
 *     summary: Crear un actor
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, biography]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               biography:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *               photo_url:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Actor creado.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
actorRouter.post('/', authMiddleware.requireAuth, authMiddleware.requireAdmin, createActorValidator, validationMiddleware, actorController.create);

/**
 * @swagger
 * /actors/{id}:
 *   put:
 *     tags: [Actors]
 *     summary: Actualizar un actor
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               biography:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *               photo_url:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Actor actualizado.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
actorRouter.put('/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, updateActorValidator, validationMiddleware, actorController.update);

/**
 * @swagger
 * /actors/{id}:
 *   delete:
 *     tags: [Actors]
 *     summary: Eliminar un actor
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Actor eliminado.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
actorRouter.delete('/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, actorIdParamValidator, validationMiddleware, actorController.delete);

export default actorRouter;