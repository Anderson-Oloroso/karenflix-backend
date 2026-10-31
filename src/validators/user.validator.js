import { body, param } from 'express-validator';
import { ROLES } from '../constants/role.constant.js';

const accountFields = ['username', 'email', 'password'];

const updateFields = [
    body('username')
        .optional()
        .trim()
        .notEmpty().withMessage('El nombre de usuario no puede estar vacío')
        .isLength({ min: 3, max: 50 }).withMessage('El username debe tener entre 3 y 50 caracteres'),
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Debe ser un correo electrónico válido')
        .isLength({ max: 100 }).withMessage('El correo no puede superar los 100 caracteres')
        .normalizeEmail(),
    body('password')
        .optional()
        .notEmpty().withMessage('La contraseña no puede estar vacía')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body().custom((_, { req }) => {
        const fields = Object.keys(req.body ?? {});
        if (!fields.length || !fields.some(field => accountFields.includes(field))) {
            throw new Error('Proporcione al menos uno de estos campos: username, email o password');
        }
        const unsupported = fields.find(field => !accountFields.includes(field));
        if (unsupported) {
            throw new Error(`El campo ${unsupported} no se puede actualizar`);
        }
        return true;
    })
];

export const updateAccountValidator = updateFields;

export const userIdParamValidator = [
    param('id')
        .isInt({ min: 1 }).withMessage('El ID del usuario debe ser un número entero positivo')
];

export const updateUserRoleValidator = [
    ...userIdParamValidator,
    body('role')
        .isIn(ROLES.all).withMessage('El rol debe ser admin o user'),
    body('admin_password')
        .isString().withMessage('La contraseña de administrador es obligatoria')
        .notEmpty().withMessage('La contraseña de administrador es obligatoria'),
    body().custom((_, { req }) => {
        const unsupported = Object.keys(req.body ?? {})
            .find(field => !['role', 'admin_password'].includes(field));
        if (unsupported) {
            throw new Error(`El campo ${unsupported} no se puede actualizar en esta ruta`);
        }
        return true;
    })
];
