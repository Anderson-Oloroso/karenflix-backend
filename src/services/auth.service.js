import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ROLES } from '../constants/role.constant.js';
import AppError from '../utils/appError.util.js';

export default class AuthService {
    #userModel;

    constructor(userModel) {
        this.#userModel = userModel;
    }

    async register(data) {
        const [existingUsername, existingEmail] = await Promise.all([
            this.#userModel.findByUsername(data.username),
            this.#userModel.findByEmail(data.email)
        ]);

        if (existingUsername || existingEmail) {
            throw AppError.conflict('El nombre de usuario o correo ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const assignedRole = ROLES.USER;
        let id;

        try {
            id = await this.#userModel.create({
                username: data.username,
                email: data.email,
                password_hash: hashedPassword,
                role: assignedRole
            });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw AppError.conflict('El nombre de usuario o correo ya está registrado');
            }
            throw error;
        }

        return {
            id,
            username: data.username,
            email: data.email,
            role: assignedRole
        };
    }

    async login(identifier, password) {
        let userRecord = await this.#userModel.findByEmail(identifier);
        if (!userRecord) {
            userRecord = await this.#userModel.findByUsername(identifier);
        }

        if (!userRecord) {
            throw AppError.unauthorized('El correo/usuario o la contraseña son incorrectos');
        }

        const isValid = await bcrypt.compare(password, userRecord.password_hash);
        if (!isValid) {
            throw AppError.unauthorized('El correo/usuario o la contraseña son incorrectos');
        }

        const user = {
            id: userRecord.id,
            username: userRecord.username,
            email: userRecord.email,
            role: userRecord.role
        };

        const token = jwt.sign({
            ...user,
            tokenVersion: Number(userRecord.token_version)
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRATION || '24h'
        });

        return { user, token };
    }

    async logout(userId) {
        await this.#userModel.incrementTokenVersion(userId);
    }
}
