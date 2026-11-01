import { body, param, query } from 'express-validator';

export const directorIdParamValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID del director debe ser un entero positivo')
];

export const directorQueryValidator = [
    query('includeMovies')
        .optional()
        .isIn(['true', 'false'])
        .withMessage('includeMovies debe ser true o false')
];

export const createDirectorValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('El nombre del director es obligatorio')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres')
];

export const updateDirectorValidator = [
    ...directorIdParamValidator,
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('El nombre no puede estar vacío')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body().custom((_, { req }) => {
        if (!Object.hasOwn(req.body, 'name')) {
            throw new Error('Proporcione al menos un campo para actualizar');
        }
        return true;
    })
];
