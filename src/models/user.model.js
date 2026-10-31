export default class UserModel {
    #db;

    constructor(db) {
        this.#db = db;
    }

    async findByUsername(username) {
        const query = 'SELECT id, username, email, password_hash, role, token_version, created_at FROM users WHERE username = ?';
        const [rows] = await this.#db.execute(query, [username]);
        return rows[0] ?? null;
    }

    async findByEmail(email) {
        const query = 'SELECT id, username, email, password_hash, role, token_version, created_at FROM users WHERE email = ?';
        const [rows] = await this.#db.execute(query, [email]);
        return rows[0] ?? null;
    }

    async findById(id) {
        const query = 'SELECT id, username, email, role, created_at FROM users WHERE id = ?';
        const [rows] = await this.#db.execute(query, [id]);
        return rows[0] ?? null;
    }

    async findAuthStateById(id) {
        const query = 'SELECT id, username, email, role, token_version FROM users WHERE id = ?';
        const [rows] = await this.#db.execute(query, [id]);
        return rows[0] ?? null;
    }

    async incrementTokenVersion(id) {
        const query = 'UPDATE users SET token_version = token_version + 1 WHERE id = ?';
        const [result] = await this.#db.execute(query, [id]);
        return result.affectedRows > 0;
    }

    async getAll() {
        const query = 'SELECT id, username, email, role, created_at FROM users ORDER BY id ASC';
        const [rows] = await this.#db.query(query);
        return rows;
    }

    async create(data) {
        const query = 'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)';
        const [result] = await this.#db.execute(query, [
            data.username,
            data.email,
            data.password_hash,
            data.role
        ]);
        return result.insertId;
    }

    async updateById(id, data) {
        const query = `
            UPDATE users
            SET username = IFNULL(?, username),
                email = IFNULL(?, email),
                password_hash = IFNULL(?, password_hash)
            WHERE id = ?
        `;
        const [result] = await this.#db.execute(query, [
            data.username ?? null,
            data.email ?? null,
            data.password_hash ?? null,
            id
        ]);
        return result.affectedRows > 0;
    }

    async deleteById(id) {
        const query = 'DELETE FROM users WHERE id = ?';
        const [result] = await this.#db.execute(query, [id]);
        return result.affectedRows > 0;
    }
}
