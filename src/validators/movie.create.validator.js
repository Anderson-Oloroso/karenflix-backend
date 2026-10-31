import { body } from 'express-validator';

const createMovieValidator = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('El título es obligatorio')
        .isLength({ min: 2, max: 150 })
        .withMessage('El título debe tener entre 2 y 150 caracteres'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('La descripción es obligatoria')
        .isLength({ min: 10 })
        .withMessage('La descripción debe tener al menos 10 caracteres'),
    body('director_id')
        .notEmpty()
        .withMessage('El director es obligatorio')
        .isInt({ min: 1 })
        .withMessage('El ID del director debe ser un entero positivo')
        .toInt(),
    body('category_id')
        .notEmpty()
        .withMessage('La categoría es obligatoria')
        .isInt({ min: 1 })
        .withMessage('El ID de la categoría debe ser un entero positivo')
        .toInt(),
    body('release_year')
        .notEmpty()
        .withMessage('El año de lanzamiento es obligatorio')
        .isInt({ min: 1888, max: new Date().getFullYear() + 5 })
        .withMessage('El año de lanzamiento no es válido')
        .toInt(),
    body('duration_minutes')
        .notEmpty()
        .withMessage('La duración es obligatoria')
        .isInt({ min: 1, max: 1000 })
        .withMessage('La duración debe ser un entero entre 1 y 1000 minutos')
        .toInt(),
    body('age_rating')
        .optional({ nullable: true })
        .trim()
        .isLength({ min: 1, max: 10 })
        .withMessage('La clasificación debe tener entre 1 y 10 caracteres'),
    body('image_url')
        .notEmpty()
        .withMessage('La URL de la imagen es obligatoria')
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
        .withMessage('El tráiler debe ser una URL válida')
];

export default createMovieValidator;
