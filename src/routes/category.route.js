import { Router } from 'express';
import Database from '../config/db.config.js';
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
const categoryModel = new CategoryModel(Database.getPool());
const categoryService = new CategoryService(categoryModel);
const categoryController = new CategoryController(categoryService);
const authMiddleware = new AuthMiddleware();

const categoryRouter = Router();

// Rutas públicas de consulta
categoryRouter.get('/', categoryController.getAll);

categoryRouter.get('/:id', categoryIdParamValidator, validationMiddleware, categoryController.getById);

// Rutas protegidas (Solo administradores)
categoryRouter.post('/', authMiddleware.requireAuth, authMiddleware.requireAdmin, createCategoryValidator, validationMiddleware, categoryController.create);

categoryRouter.put('/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, updateCategoryValidator, validationMiddleware, categoryController.update);

categoryRouter.delete('/:id', authMiddleware.requireAuth, authMiddleware.requireAdmin, categoryIdParamValidator, validationMiddleware, categoryController.delete);

export default categoryRouter;
