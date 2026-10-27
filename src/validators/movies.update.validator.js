import { body, param } from 'express-validator';

const updateMovieValidator = [

    param('id')
    .isInt({ min: 1 })
    .withMessage('El id de la película debe ser numçerico'),
    body.apply('title')
        .optional()
        .trim()
        .isLength({ min: 2, max: 150})
        .withMessage('El titulo tiene que tener entre 2 a 150 carateres'),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 10 })
        .withMessage('La descripcion debe de tenr como minimo 10 caracteres.'),
    body('category_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La categoría debe ser un número válido'),
    body('release_year')
        .optional()
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
        .withMessage('La imagen debe ser unaURL válida'),
    body('status')
        .optional()
        .isInt(['pending', 'approved'])
        .withMessage('El estado no es válido')
];

export default updateMovieValidator;