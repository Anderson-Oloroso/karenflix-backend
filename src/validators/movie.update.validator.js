import { body, param } from 'express-validator';

export const movieIdParamValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El id de la película debe ser numérico')
];

const updateMovieValidator = [
    ...movieIdParamValidator,
    body('title')
        .optional()
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage('El titulo tiene que tener entre 2 a 150 caracteres'),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 10 })
        .withMessage('La descripcion debe tener como minimo 10 caracteres.'),
    body('category_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La categoría debe ser un número válido'),
    body('release_year')
        .optional()
        .isInt({
            min: 1900,
            max: new Date().getFullYear() + 5
        })
        .withMessage('El año de lanzamiento no es válido'),
    body('image_url')
        .optional({
            nullable: true,
            checkFalsy: true
        })
        .isURL()
        .withMessage('La imagen debe ser una URL válida'),
    body('status')
        .optional()
        .isIn(['pending', 'approved'])
        .withMessage('El estado no es válido'),
    body().custom((value) => {
        if (!Object.keys(value ?? {}).length) {
            throw new Error('Proporcione al menos un campo para actualizar');
        }
        return true;
    })
];

export default updateMovieValidator;
