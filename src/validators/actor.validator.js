import { body, param } from 'express-validator';

const today = new Date().toISOString().slice(0, 10);

export const createActorValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre del actor es obligatorio')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('biography')
        .optional({ nullable: true })
        .isString().withMessage('La biografía debe ser texto')
        .isLength({ min: 10, max: 500 }).withMessage('La biografía debe tener entre 10 y 500 caracteres'),
    body('birth_date')
        .optional({ nullable: true })
        .isISO8601({ strict: true, strictSeparator: true })
        .withMessage('La fecha de nacimiento debe tener el formato YYYY-MM-DD')
        .custom(value => value <= today)
        .withMessage('La fecha de nacimiento no puede ser futura'),
    body('photo_url')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 255 }).withMessage('La URL de la foto no puede superar los 255 caracteres')
        .isURL().withMessage('La foto debe ser una URL válida')
];

export const updateActorValidator = [
    param('id')
        .isInt({ min: 1 }).withMessage('El ID del actor debe ser un número entero positivo'),
    body('name')
        .optional()
        .trim()
        .notEmpty().withMessage('El nombre no puede estar vacío si se proporciona')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('biography')
        .optional({ nullable: true })
        .trim()
        .isLength({ min: 10, max: 500 }).withMessage('La biografía debe tener entre 10 y 500 caracteres'),
    body('birth_date')
        .optional({ nullable: true })
        .isISO8601({ strict: true, strictSeparator: true })
        .withMessage('La fecha de nacimiento debe tener el formato YYYY-MM-DD')
        .custom(value => value <= today)
        .withMessage('La fecha de nacimiento no puede ser futura'),
    body('photo_url')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 255 }).withMessage('La URL de la foto no puede superar los 255 caracteres')
        .isURL().withMessage('La foto debe ser una URL válida'),
    body().custom((_, { req }) => {
        const fields = ['name', 'biography', 'birth_date', 'photo_url'];
        if (!fields.some(field => Object.hasOwn(req.body, field))) {
            throw new Error('Debe proporcionar al menos un campo para actualizar');
        }
        return true;
    })
];

export const actorIdParamValidator = [
    param('id')
        .isInt({ min: 1 }).withMessage('El ID del actor debe ser un número entero positivo')
];
