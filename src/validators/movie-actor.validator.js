import { body, param } from 'express-validator';

export const movieActorIdParamValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero positivo')
];

export const movieIdParamValidator = [
    param('movieId')
        .isInt({ min: 1 })
        .withMessage('El ID de la película debe ser un número entero positivo')
];

export const actorIdParamValidator = [
    param('actorId')
        .isInt({ min: 1 })
        .withMessage('El ID del actor debe ser un número entero positivo')
];

export const createMovieActorValidator = [
    body('movie_id')
        .notEmpty().withMessage('El ID de la película es requerido')
        .isInt({ min: 1 }).withMessage('El ID de la película debe ser un número entero positivo'),
    body('actor_id')
        .notEmpty().withMessage('El ID del actor es requerido')
        .isInt({ min: 1 }).withMessage('El ID del actor debe ser un número entero positivo'),
    body('character_name')
        .optional({ nullable: true })
        .isString().withMessage('El nombre del personaje debe ser una cadena de texto')
        .trim()
        .isLength({ max: 100 }).withMessage('El nombre del personaje no debe superar los 100 caracteres')
];

export const updateMovieActorValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero positivo'),
    body('movie_id')
        .optional()
        .isInt({ min: 1 }).withMessage('El ID de la película debe ser un número entero positivo'),
    body('actor_id')
        .optional()
        .isInt({ min: 1 }).withMessage('El ID del actor debe ser un número entero positivo'),
    body('character_name')
        .optional({ nullable: true })
        .isString().withMessage('El nombre del personaje debe ser una cadena de texto')
        .trim()
        .isLength({ max: 100 }).withMessage('El nombre del personaje no debe superar los 100 caracteres'),
    body().custom((value, { req }) => {
        const allowedFields = ['movie_id', 'actor_id', 'character_name'];
        const hasAtLeastOne = allowedFields.some(field => req.body[field] !== undefined);
        if (!hasAtLeastOne) {
            throw new Error('Debe proporcionar al menos un campo para actualizar (movie_id, actor_id o character_name)');
        }
        return true;
    })
];
