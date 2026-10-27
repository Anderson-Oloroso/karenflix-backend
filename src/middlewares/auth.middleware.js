import jwt from 'jsonwebtoken';
import { ROLES } from '../constants/roles.constant.js';

export default class AuthMiddleware {
    #jwtSecret;

    constructor(jwtSecret = process.env.JWT_SECRET) {
        this.#jwtSecret = jwtSecret;
        this.requireAuth = this.requireAuth.bind(this);
        this.requireAdmin = this.requireAdmin.bind(this);
        this.requireRole = this.requireRole.bind(this);
    }

    requireAuth(req, res, next) {
        const authHeader = req.headers.authorization;
        const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
        const token = req.cookies?.access_token || bearerToken;

        if (!token) {
            return res.status(401).json({
                status: 'Fail',
                message: 'Usuario no autenticado. --> Iniciar Sesión'
            });
        }

        try {
            const decoded = jwt.verify(token, this.#jwtSecret);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({
                status: 'Fail',
                message: 'Token inválido o expirado'
            });
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

