import jwt from 'jsonwebtoken';
import { ROLES } from '../constants/role.constant.js';
import Database from '../config/db.config.js';
import UserModel from '../models/user.model.js';
import AppError from '../utils/appError.util.js';

export default class AuthMiddleware {
    #jwtSecret;
    #userModel;

    constructor(jwtSecret = process.env.JWT_SECRET, userModel = new UserModel(Database.getPool())) {
        this.#jwtSecret = jwtSecret;
        this.#userModel = userModel;
        this.requireAuth = this.requireAuth.bind(this);
        this.requireAdmin = this.requireAdmin.bind(this);
    }

    async requireAuth(req, _res, next) {
        const authHeader = req.headers.authorization;
        const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        if (!bearerToken) {
            return next(AppError.unauthorized('Se requiere un token Bearer.'));
        }

        let decoded;
        try {
            decoded = jwt.verify(bearerToken, this.#jwtSecret);
        } catch {
            return next(AppError.unauthorized('Token inválido o expirado.'));
        }

        try {
            const user = await this.#userModel.findById(decoded.id);
            if (!user) {
                return next(AppError.unauthorized('La cuenta asociada a este token ya no existe.'));
            }

            req.user = {
                ...decoded,
                username: user.username,
                email: user.email,
                role: user.role
            };
            return next();
        } catch (error) {
            return next(error);
        }
    }

    requireAdmin(req, _res, next) {
        if (req.user?.role !== ROLES.ADMIN) {
            return next(AppError.forbidden('Se requieren permisos de administrador.'));
        }
        return next();
    }
}
