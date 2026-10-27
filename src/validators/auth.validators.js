import { body, param, validationResult } from 'express-validator';
import { ROLES } from '../constants/roles.constant.js';

export function managerValidationErrors(req, res, next) {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const err = new Error('Errores de validación');
        err.statusCode = 400;
        err.details = errores.array();
        return next(err);
    }
    next();
}

export const validationsRegister = [
    body('username')
        .trim()
        .notEmpty().withMessage('El nombre de usuario es obligatorio')
        .isLength({ min: 3, max: 50 }).withMessage('El username debe tener entre 3 y 50 caracteres'),

    body('email')
        .trim()
        .notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

    body('role')
        .optional()
        .isIn(ROLES.all).withMessage(`El rol debe ser uno de los permitidos: ${ROLES.all.join(', ')}`),

    managerValidationErrors
];

export const validationsLogin = [
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Debe ser un correo válido'),

    body('username')
        .optional()
        .trim()
        .notEmpty().withMessage('El username no puede estar vacío'),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),

    managerValidationErrors
];

export const validationsUserId = [
    param('id')
        .isInt({ min: 1 }).withMessage('El ID de usuario debe ser un número entero válido'),

    managerValidationErrors
];
