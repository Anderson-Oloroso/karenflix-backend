export default class HistorialModel {
    #db;

    constructor(db) {
        this.#db = db;
    }

    async insert(entry, connection = this.#db) {
        const [result] = await connection.execute(
            `INSERT INTO historial (user_id, action, review_id, movie_id)
            VALUES (?, ?, ?, ?)`,
            [entry.user_id, entry.action, entry.review_id, entry.movie_id]
        );

        return result;
    }

    async getByUserId(userId, filters = {}) {
        const conditions = ['user_id = ?'];
        const values = [userId];
        if (filters.action) {
            conditions.push('action = ?');
            values.push(filters.action);
        }

        const [rows] = await this.#db.execute(
            `SELECT id, action, review_id, movie_id, created_at
            FROM historial
            WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC, id DESC`,
            values
        );

        return rows;
    }
}