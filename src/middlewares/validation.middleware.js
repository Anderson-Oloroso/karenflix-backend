import { validationResult } from 'express-validator';
import AppError from '../utils/appError.util.js';

export default class ValidationMiddleware {
    static validate(req, _res, next) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const details = errors.array().map(({ type, msg, path, location }) => ({
                type,
                msg,
                path,
                location
            }));
            return next(AppError.badRequest('Error de validación.', details));
        }
        return next();
    }
}

export const validationMiddleware = ValidationMiddleware.validate;
