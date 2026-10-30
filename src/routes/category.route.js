import { Router } from 'express';
import { pool } from '../config/db.config.js';
import CategoryModel from '../models/category.model.js';
import CategoryService from '../services/category.service.js';
import CategoryController from '../controllers/category.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';
import {
    createCategoryValidator,
    updateCategoryValidator,
    categoryIdParamValidator
} from '../validators/category.validator.js';

// Ensamblaje / Inyección de dependencias
const categoryModel = new CategoryModel(pool);
const categoryService = new CategoryService(categoryModel);
const categoryController = new CategoryController(categoryService);
const authMiddleware = new AuthMiddleware();

const categoryRouter = Router();

// Rutas públicas de consulta
/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Listar categorías
 *     responses:
 *       200:
 *         description: Lista de categorías.
 */
categoryRouter.get('/', categoryController.getAll);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Obtener una categoría por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Categoría encontrada.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
categoryRouter.get('/:id', categoryIdParamValidator, validationMiddleware, categoryController.getById);

// Rutas protegidas (Solo administradores)
/**
 * @swagger
 * /categories:
 *   post:
 *     tags: [Categories]
 *     summary: Crear una categoría
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               description:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Categoría creada.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
categoryRouter.post('/', authMiddleware.requireAuth, authMiddleware.requireAdmin, createCategoryValidator, validationMiddleware, categoryController.create);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     tags: [Categories]
 *     summary: Actualizar una categoría
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
 *                 maxLength: 50
 *               description:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Categoría actualizada.
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
categoryRouter.put('/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, updateCategoryValidator, validationMiddleware, categoryController.update);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Eliminar una categoría
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
 *         description: Categoría eliminada.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
categoryRouter.delete('/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, categoryIdParamValidator, validationMiddleware, categoryController.delete);

export default categoryRouter;
