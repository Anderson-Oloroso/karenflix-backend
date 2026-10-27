import { pool } from '../config/db.config.js';

export class UserModel {
    #db
    constructor(pool) {
        this.#db = pool;
    }

    async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = ? LIMIT 1';
        const [rows] = await this.#db.execute(query, [username]);
        return rows[0] ?? null;
    }

    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
        const [rows] = await this.#db.execute(query, [email]);
        return rows[0] ?? null;
    }

    async findById(id) {
        const query = 'SELECT id, username, email, role, created_at FROM users WHERE id = ? LIMIT 1';
        const [rows] = await this.#db.execute(query, [id]);
        return rows[0] ?? null;
    }

    async create({ username, email, passwordHash, role }) {
        const query = `
            INSERT INTO users (username, email, password_hash, role)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await this.db.execute(query, [username, email, passwordHash, role]);
        return result.insertId;
    }
}