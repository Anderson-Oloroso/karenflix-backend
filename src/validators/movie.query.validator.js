import { query } from 'express-validator';

const movieQueryValidator = [
    query('category')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La categoría debe ser un número entero positivo')
        .toInt(),
    query('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('El título de búsqueda no puede estar vacío'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La página debe ser un número entero positivo')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('El límite debe ser un número entero entre 1 y 100')
        .toInt()
];

export default movieQueryValidator;
