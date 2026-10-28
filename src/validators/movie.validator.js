import { body } from 'express-validator';

const createMovieValidator = [
    body.apply('title')
        .trim()
        .notEmpty()
        .withMessage(' El titulo es obligatorio ...')
        .isLength({ min: 2, max: 150})
        .withMessage('El titulo tiene que tener entre 2 a 150 carateres'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('La descripcion es un campo obligatorio')
        .isLength({ min: 10 })
        .withMessage('La descripcion debe de tenr como minimo 10 caracteres.'),
    body('category_id')
        .notEmpty()
        .withMessage('La categoria es obligatoria')
        .isInt({ min: 1 })
        .withMessage('La categoría debe ser un número válido'),
    body('release_year')
        .notEmpty()
        .withMessage('El año de lanzamiento es un campo obligatorio.')
        .isInt({
            min: 1900,
            max: new
            Date().getFullYear() + 5
        })
        .withMessage('El año de lanzamiento no es válido'),
    body('image_url')
        .optional({
            nullable: true,
            checkFalsy: true
        })
        .isURL()
        .withMessage('La imagen debe ser unaURL válida')
];

export default createMovieValidator;