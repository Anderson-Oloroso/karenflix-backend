import { ROLES } from '../constants/role.constant.js';

export default class RoleMiddleware {
    static requireAdmin(req, res, next) {
        if (req.user?.role !== ROLES.ADMIN) {
            return res.status(403).json({
                status: 'Fail',
                message: 'Acceso denegado, se requieren permisos de administrador'
            });
        }
        next();
    }

    static requireRoles(...allowedRoles) {
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
