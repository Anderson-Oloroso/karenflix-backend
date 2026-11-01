import passport from 'passport';
import { ROLES } from '../constants/role.constant.js';
import AppError from '../utils/appError.util.js';

export default class AuthMiddleware {
    constructor() {
        this.requireAuth = this.requireAuth.bind(this);
        this.requireAdmin = this.requireAdmin.bind(this);
    }

    requireAuth(req, res, next) {
        passport.authenticate('jwt', { session: false }, (error, user) => {
            if (error) return next(error);
            if (!user) return next(AppError.unauthorized('Token inválido, expirado o revocado.'));

            req.user = user;
            return next();
        })(req, res, next);
    }

    requireAdmin(req, _res, next) {
        if (req.user?.role !== ROLES.ADMIN) {
            return next(AppError.forbidden('Se requieren permisos de administrador.'));
        }
        return next();
    }
}
