import { body, param } from 'express-validator';

export const movieIdParamValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID de la película debe ser un entero positivo')
];

const updateMovieValidator = [
    ...movieIdParamValidator,
    body('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('El título no puede estar vacío')
        .isLength({ min: 2, max: 150 })
        .withMessage('El título debe tener entre 2 y 150 caracteres'),
    body('description')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('La descripción no puede estar vacía')
        .isLength({ min: 10 })
        .withMessage('La descripción debe tener al menos 10 caracteres'),
    body('director_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El ID del director debe ser un entero positivo')
        .toInt(),
    body('category_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El ID de la categoría debe ser un entero positivo')
        .toInt(),
    body('release_year')
        .optional()
        .isInt({ min: 1888, max: new Date().getFullYear() + 5 })
        .withMessage('El año de lanzamiento no es válido')
        .toInt(),
    body('duration_minutes')
        .optional()
        .isInt({ min: 1, max: 1000 })
        .withMessage('La duración debe ser un entero entre 1 y 1000 minutos')
        .toInt(),
    body('age_rating')
        .optional({ nullable: true })
        .trim()
        .isLength({ min: 1, max: 10 })
        .withMessage('La clasificación debe tener entre 1 y 10 caracteres'),
    body('image_url')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('La URL de la imagen no puede estar vacía')
        .isLength({ max: 255 })
        .withMessage('La URL de la imagen no puede superar los 255 caracteres')
        .isURL()
        .withMessage('La imagen debe ser una URL válida'),
    body('banner_url')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 255 })
        .withMessage('La URL del banner no puede superar los 255 caracteres')
        .isURL()
        .withMessage('El banner debe ser una URL válida'),
    body('trailer_url')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 255 })
        .withMessage('La URL del tráiler no puede superar los 255 caracteres')
        .isURL()
        .withMessage('El tráiler debe ser una URL válida'),
    body('status')
        .optional()
        .isIn(['pending', 'approved', 'rejected'])
        .withMessage('El estado debe ser pending, approved o rejected'),
    body().custom((_, { req }) => {
        const fields = [
            'title', 'description', 'director_id', 'category_id', 'release_year',
            'duration_minutes', 'age_rating', 'image_url', 'banner_url',
            'trailer_url', 'status'
        ];
        if (!fields.some(field => Object.hasOwn(req.body, field))) {
            throw new Error('Proporcione al menos un campo para actualizar');
        }
        return true;
    })
];

export default updateMovieValidator;
