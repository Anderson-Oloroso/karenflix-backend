export default class ReviewModel {
    #db;

    constructor(db) {
        this.#db = db;
    }

    async getByMovieId(movieId, connection = this.#db) {
        const [rows] = await connection.execute(
            `SELECT
                r.id,
                r.movie_id,
                u.username,
                r.title,
                r.comment,
                r.rating,
                COALESCE(reaction_counts.likes, 0) AS likes_count,
                COALESCE(reaction_counts.dislikes, 0) AS dislikes_count,
                r.created_at
            FROM reviews r
            INNER JOIN users u ON u.id = r.user_id
            LEFT JOIN (
                SELECT
                    review_id,
                    SUM(reaction_type = 'like') AS likes,
                    SUM(reaction_type = 'dislike') AS dislikes
                FROM review_reactions
                GROUP BY review_id
            ) reaction_counts ON reaction_counts.review_id = r.id
            WHERE r.movie_id = ?
            ORDER BY r.created_at DESC`,
            [movieId]
        );

        return rows;
    }

    async movieExists(movieId, connection = this.#db) {
        const [rows] = await connection.execute(
            "SELECT id FROM movies WHERE id = ? AND status = 'approved' LIMIT 1",
            [movieId]
        );

        return rows.length > 0;
    }

    async userAlreadyReviewed(movieId, userId, connection = this.#db) {
        const [rows] = await connection.execute(
            'SELECT id FROM reviews WHERE movie_id = ? AND user_id = ? LIMIT 1',
            [movieId, userId]
        );

        return rows.length > 0;
    }

    async getByIdForUpdate(reviewId, connection) {
        const [rows] = await connection.execute(
            `SELECT id, movie_id, user_id, title, comment, rating
            FROM reviews
            WHERE id = ?
            FOR UPDATE`,
            [reviewId]
        );
        return rows[0] ?? null;
    }

    async insert(review, connection) {
        const [result] = await connection.execute(
            `INSERT INTO reviews (movie_id, user_id, title, comment, rating)
            VALUES (?, ?, ?, ?, ?)`,
            [review.movie_id, review.user_id, review.title, review.comment, review.rating]
        );

        return result;
    }

    async updateById(reviewId, data, connection) {
        const fields = {
            title: 'title',
            comment: 'comment',
            rating: 'rating'
        };
        const updates = Object.entries(fields)
            .filter(([field]) => Object.hasOwn(data, field))
            .map(([field, column]) => ({ column, value: data[field] }));
        if (updates.length === 0) {
            return false;
        }
        const assignments = updates.map(({ column }) => `${column} = ?`).join(', ');
        const [result] = await connection.execute(
            `UPDATE reviews SET ${assignments} WHERE id = ?`,
            [...updates.map(({ value }) => value), reviewId]
        );
        return result.affectedRows > 0;
    }

    async deleteById(reviewId, connection) {
        const [result] = await connection.execute(
            'DELETE FROM reviews WHERE id = ?',
            [reviewId]
        );
        return result.affectedRows > 0;
    }
}
