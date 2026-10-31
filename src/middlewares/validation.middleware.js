import { validationResult } from 'express-validator';
import AppError from '../utils/appError.util.js';

export default class ValidationMiddleware {
    static validate(req, _res, next) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(AppError.badRequest('Error de validación.', errors.array()));
        }
        return next();
    }
}

export const validationMiddleware = ValidationMiddleware.validate;
