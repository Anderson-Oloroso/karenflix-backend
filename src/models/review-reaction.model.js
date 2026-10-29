export default class ReviewReactionModel {
    #db;

    constructor(db) {
        if (!db) {
            throw new Error('Una instancia de base de datos es requerida para ReviewReactionModel');
        }
        this.#db = db;
    }

    async getReviewById(reviewId, connection = this.#db) {
        const [rows] = await connection.execute(
            'SELECT id, user_id FROM reviews WHERE id = ? FOR UPDATE',
            [reviewId]
        );
        return rows[0] ?? null;
    }

    async getByReviewAndUser(reviewId, userId, connection = this.#db) {
        const [rows] = await connection.execute(
            'SELECT id, reaction_type FROM review_reactions WHERE review_id = ? AND user_id = ? FOR UPDATE',
            [reviewId, userId]
        );
        return rows[0] ?? null;
    }

    async create(data, connection = this.#db) {
        const [result] = await connection.execute(
            'INSERT INTO review_reactions (review_id, user_id, reaction_type) VALUES (?, ?, ?)',
            [data.review_id, data.user_id, data.reaction_type]
        );
        return result.insertId;
    }

    async update(id, reactionType, connection = this.#db) {
        const [result] = await connection.execute(
            'UPDATE review_reactions SET reaction_type = ? WHERE id = ?',
            [reactionType, id]
        );
        return result.affectedRows > 0;
    }

    async delete(id, connection = this.#db) {
        const [result] = await connection.execute(
            'DELETE FROM review_reactions WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    async getCounts(reviewId, connection = this.#db) {
        const [rows] = await connection.execute(
            `SELECT
                COALESCE(SUM(reaction_type = 'like'), 0) AS likes,
                COALESCE(SUM(reaction_type = 'dislike'), 0) AS dislikes
            FROM review_reactions
            WHERE review_id = ?`,
            [reviewId]
        );
        return rows[0];
    }
}
