import { body, param } from 'express-validator';

export const reviewMovieIdParamValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID de la película debe ser un número entero positivo')
];

export const createReviewValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID de la película debe ser un número entero positivo'),
    body('rating')
        .notEmpty()
        .withMessage('El rating es obligatorio.')
        .isInt({ min: 1, max: 10 })
        .withMessage('El rating debe ser un número entero entre 1 y 10.')
        .toInt(),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('El título de la reseña es obligatorio.')
        .isLength({ min: 3, max: 100 })
        .withMessage('El título debe tener entre 3 y 100 caracteres.'),
    body('comment')
        .trim()
        .notEmpty()
        .withMessage('El comentario es obligatorio.')
        .isLength({ min: 10, max: 1000 })
        .withMessage('El comentario debe tener entre 10 y 1000 caracteres.')
];

export default createReviewValidator;
