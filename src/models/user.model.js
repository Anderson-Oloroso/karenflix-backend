export default class UserModel {
    #db;

    constructor(db) {
        this.#db = db;
    }

    async findByUsername(username) {
        const query = 'SELECT id, username, email, password_hash, role, created_at FROM users WHERE username = ?';
        const [rows] = await this.#db.execute(query, [username]);
        return rows[0] ?? null;
    }

    async findByEmail(email) {
        const query = 'SELECT id, username, email, password_hash, role, created_at FROM users WHERE email = ?';
        const [rows] = await this.#db.execute(query, [email]);
        return rows[0] ?? null;
    }

    async findById(id) {
        const query = 'SELECT id, username, email, role, created_at FROM users WHERE id = ?';
        const [rows] = await this.#db.execute(query, [id]);
        return rows[0] ?? null;
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
}
