import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ROLES } from '../constants/role.constant.js';

export default class AuthService {
    #userModel;

    constructor(userModel) {
        this.#userModel = userModel;
    }

    async register(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const assignedRole = data.role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.USER;

        const id = await this.#userModel.create({
            username: data.username,
            email: data.email,
            password_hash: hashedPassword,
            role: assignedRole
        });

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

        if (!userRecord) return null;

        const isValid = await bcrypt.compare(password, userRecord.password_hash);
        if (!isValid) return null;

        const user = {
            id: userRecord.id,
            username: userRecord.username,
            email: userRecord.email,
            role: userRecord.role
        };

        const token = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRATION || '24h'
        });

        return { user, token };
    }

    async profile(userId) {
        const user = await this.#userModel.findById(userId);
        if (!user) return null;

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.created_at
        };
    }
}
