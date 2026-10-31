import bcrypt from 'bcrypt';
import { ROLES } from '../constants/role.constant.js';
import AppError from '../utils/appError.util.js';

export default class UserService {
    #userModel;

    constructor(userModel) {
        this.#userModel = userModel;
    }

    async getAll() {
        return this.#userModel.getAll();
    }

    async getById(userId) {
        const user = await this.#userModel.findById(userId);
        if (!user) {
            throw AppError.notFound(`No se encontró ningún usuario con el ID ${userId}`);
        }

        return user;
    }

    async update(userId, data) {
        await this.getById(userId);

        if (data.username) {
            const usernameOwner = await this.#userModel.findByUsername(data.username);
            if (usernameOwner && Number(usernameOwner.id) !== Number(userId)) {
                throw AppError.conflict('El nombre de usuario ya está registrado');
            }
        }

        if (data.email) {
            const emailOwner = await this.#userModel.findByEmail(data.email);
            if (emailOwner && Number(emailOwner.id) !== Number(userId)) {
                throw AppError.conflict('El correo ya está registrado');
            }
        }

        const update = {
            username: data.username,
            email: data.email
        };
        if (data.password) {
            update.password_hash = await bcrypt.hash(data.password, 10);
        }

        try {
            await this.#userModel.updateById(userId, update);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw AppError.conflict('El nombre de usuario o correo ya está registrado');
            }
            throw error;
        }

        return this.getById(userId);
    }

    async updateRole(userId, role, adminId, adminPassword) {
        if (!ROLES.all.includes(role)) {
            throw AppError.badRequest('El rol debe ser admin o user');
        }

        const admin = await this.#userModel.findCredentialsById(adminId);
        if (!admin || admin.role !== ROLES.ADMIN) {
            throw AppError.forbidden('Se requieren credenciales de administrador.');
        }

        const passwordMatches = admin.password_hash
            && await bcrypt.compare(adminPassword, admin.password_hash);
        if (!passwordMatches) {
            throw AppError.unauthorized('La contraseña de administrador es incorrecta.');
        }

        if (Number(userId) === Number(adminId)) {
            throw AppError.badRequest('No puedes cambiar tu propio rol.');
        }

        await this.getById(userId);
        await this.#userModel.updateRoleById(userId, role);
        return this.getById(userId);
    }

    async delete(userId) {
        await this.getById(userId);
        const deleted = await this.#userModel.deleteById(userId);
        if (!deleted) {
            throw AppError.notFound(`No se encontró ningún usuario con el ID ${userId}`);
        }

        return { id: Number(userId) };
    }
}
