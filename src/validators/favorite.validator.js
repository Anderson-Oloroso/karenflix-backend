import { body, param } from 'express-validator';

export const createFavoriteValidator = [
    body('movie_id')
        .isInt({ min: 1 })
        .withMessage('El ID de la película debe ser un número entero positivo')
];

export const favoriteIdParamValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID del favorito debe ser un número entero positivo')
];