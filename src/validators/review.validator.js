import { body } from 'express-validator';

/**
 * Validaciones para la creación de una reseña.
 *
 * Reglas:
 *  - rating  : entero obligatorio, entre 1 y 10 (inclusive).
 *  - title   : cadena obligatoria, entre 3 y 100 caracteres.
 *  - comment : cadena obligatoria, mínimo 10 caracteres y máximo 1 000.
 */
const reviewValidator = [
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
        .withMessage('El comentario debe tener entre 10 y 1 000 caracteres.'),
];

export default reviewValidator;
