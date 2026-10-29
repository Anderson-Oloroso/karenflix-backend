import jwt from 'jsonwebtoken';
import { ROLES } from '../constants/role.constant.js';
import { pool } from '../config/db.config.js';
import UserModel from '../models/user.model.js';

export default class AuthMiddleware {
    #jwtSecret;
    #userModel;

    constructor(jwtSecret = process.env.JWT_SECRET, userModel = new UserModel(pool)) {
        this.#jwtSecret = jwtSecret;
        this.#userModel = userModel;
        this.requireAuth = this.requireAuth.bind(this);
        this.requireAdmin = this.requireAdmin.bind(this);
        this.requireRole = this.requireRole.bind(this);
    }

    async requireAuth(req, res, next) {
        const authHeader = req.headers.authorization;
        const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
        const token = req.cookies?.access_token || bearerToken;

        if (!token) {
            return res.status(401).json({
                status: 'Fail',
                message: 'Usuario no autenticado. --> Iniciar Sesión'
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, this.#jwtSecret);
        } catch {
            return res.status(401).json({
                status: 'Fail',
                message: 'Token inválido o expirado'
            });
        }

        try {
            const user = await this.#userModel.findById(decoded.id);
            if (!user) {
                return res.status(401).json({
                    status: 'Fail',
                    message: 'La cuenta asociada a este token ya no existe'
                });
            }

            req.user = {
                ...decoded,
                username: user.username,
                email: user.email,
                role: user.role
            };
            next();
        } catch (error) {
            next(error);
        }
    }

    requireAdmin(req, res, next) {
        if (req.user?.role !== ROLES.ADMIN) {
            return res.status(403).json({
                status: 'Fail',
                message: 'Acceso denegado, se requiere permisos de administrador'
            });
        }
        next();
    }

    requireRole(...allowedRoles) {
        return (req, res, next) => {
            if (!req.user || !allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    status: 'Fail',
                    message: `Acceso denegado, se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}`
                });
            }
            next();
        };
    }
}
