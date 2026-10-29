import { validationResult } from 'express-validator';

export default class ValidationMiddleware {
    static validate(req, res, next) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'Fail',
                message: 'Error de validación...',
                errors: errors.array()
            });
        }
        next();
    }
}

export const validationMiddleware = ValidationMiddleware.validate;
