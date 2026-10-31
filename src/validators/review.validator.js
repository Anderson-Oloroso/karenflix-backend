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

export const reviewIdParamValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID de la película debe ser un número entero positivo'),
    param('reviewId')
        .isInt({ min: 1 })
        .withMessage('El ID de la reseña debe ser un número entero positivo')
];

export const updateReviewValidator = [
    ...reviewIdParamValidator,
    body('rating')
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage('El rating debe ser un número entero entre 1 y 10.')
        .toInt(),
    body('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('El título de la reseña no puede estar vacío.')
        .isLength({ min: 3, max: 100 })
        .withMessage('El título debe tener entre 3 y 100 caracteres.'),
    body('comment')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('El comentario no puede estar vacío.')
        .isLength({ min: 10, max: 1000 })
        .withMessage('El comentario debe tener entre 10 y 1000 caracteres.'),
    body().custom((_, { req }) => {
        const allowedFields = ['title', 'comment', 'rating'];
        const fields = Object.keys(req.body ?? {});
        if (!fields.length || fields.some(field => !allowedFields.includes(field))) {
            throw new Error('Proporcione al menos un campo válido para actualizar la reseña.');
        }
        return true;
    })
];

export default createReviewValidator;
