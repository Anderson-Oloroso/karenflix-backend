import { body, param } from 'express-validator';

export const createCategoryValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre de la categoría es obligatorio')
        .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    body('description')
        .trim()
        .notEmpty().withMessage('La descripción es obligatoria')
        .isLength({ min: 3, max: 500 }).withMessage('La descripción debe tener entre 3 y 500 caracteres')
];

export const updateCategoryValidator = [
    param('id')
        .isInt({ min: 1 }).withMessage('El ID de la categoría debe ser un número entero positivo'),
    body('name')
        .optional()
        .trim()
        .notEmpty().withMessage('El nombre no puede estar vacío si se proporciona')
        .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    body('description')
        .optional()
        .trim()
        .notEmpty().withMessage('La descripción no puede estar vacía si se proporciona')
        .isLength({ min: 3, max: 500 }).withMessage('La descripción debe tener entre 3 y 500 caracteres'),
    body().custom((value, { req }) => {
        if (!req.body.name && !req.body.description) {
            throw new Error('Debe proporcionar al menos un campo para actualizar (name o description)');
        }
        return true;
    })
];

export const categoryIdParamValidator = [
    param('id')
        .isInt({ min: 1 }).withMessage('El ID de la categoría debe ser un número entero positivo')
];
