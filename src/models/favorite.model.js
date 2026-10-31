export default class FavoriteModel {
    #db;

    constructor(db) {
        this.#db = db;
    }

    async getByUser(userId) {
        const query = `SELECT
                f.id,
                f.user_id,
                f.movie_id,
                f.created_at,
                m.title,
                m.description,
                c.name AS category_name,
                m.release_year,
                m.image_url,
                m.status
            FROM favorites f
            INNER JOIN movies m ON m.id = f.movie_id
            INNER JOIN categories c ON c.id = m.category_id
            WHERE f.user_id = ?
            ORDER BY f.created_at DESC`;
        const [rows] = await this.#db.execute(query, [userId]);
        return rows;
    }

    async getByIdForUser(id, userId) {
        const query = `SELECT
                f.id,
                f.user_id,
                f.movie_id,
                f.created_at,
                m.title,
                m.description,
                c.name AS category_name,
                m.release_year,
                m.image_url,
                m.status
            FROM favorites f
            INNER JOIN movies m ON m.id = f.movie_id
            INNER JOIN categories c ON c.id = m.category_id
            WHERE f.id = ? AND f.user_id = ?`;
        const [rows] = await this.#db.execute(query, [id, userId]);
        return rows[0] ?? null;
    }

    async movieExists(movieId) {
        const [rows] = await this.#db.execute(
            'SELECT id FROM movies WHERE id = ?',
            [movieId]
        );
        return rows.length > 0;
    }

    async existsByUserAndMovie(userId, movieId) {
        const [rows] = await this.#db.execute(
            'SELECT id FROM favorites WHERE user_id = ? AND movie_id = ?',
            [userId, movieId]
        );
        return rows.length > 0;
    }

    async create(data) {
        const query = 'INSERT INTO favorites (user_id, movie_id) VALUES (?, ?)';
        const [result] = await this.#db.execute(query, [data.user_id, data.movie_id]);
        return result.insertId;
    }

    async deleteByUser(id, userId) {
        const query = 'DELETE FROM favorites WHERE id = ? AND user_id = ?';
        const [result] = await this.#db.execute(query, [id, userId]);
        return result.affectedRows > 0;
    }
}
