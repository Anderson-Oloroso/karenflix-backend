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
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('biography')
        .optional({ nullable: true })
        .isString()
        .withMessage('La biografía debe ser texto')
        .isLength({ max: 5000 })
        .withMessage('La biografía no puede superar los 5000 caracteres'),
    body('photo_url')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 255 })
        .withMessage('La URL de la foto no puede superar los 255 caracteres')
        .isURL()
        .withMessage('La foto debe ser una URL válida')
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
    body('biography')
        .optional({ nullable: true })
        .isString()
        .withMessage('La biografía debe ser texto')
        .isLength({ max: 5000 })
        .withMessage('La biografía no puede superar los 5000 caracteres'),
    body('photo_url')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 255 })
        .withMessage('La URL de la foto no puede superar los 255 caracteres')
        .isURL()
        .withMessage('La foto debe ser una URL válida'),
    body().custom((_, { req }) => {
        if (!['name', 'biography', 'photo_url'].some(field => Object.hasOwn(req.body, field))) {
            throw new Error('Proporcione al menos un campo para actualizar');
        }
        return true;
    })
];
