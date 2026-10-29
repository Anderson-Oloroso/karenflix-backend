export default class ReviewModel {
    #db;

    constructor(db) {
        this.#db = db;
    }

    async getByMovieId(movieId) {
        const [rows] = await this.#db.query(
            `SELECT
                r.id,
                r.movie_id,
                u.username,
                r.title,
                r.comment,
                r.rating,
                r.likes_count,
                r.created_at
            FROM reviews r
            INNER JOIN users u ON u.id = r.user_id
            WHERE r.movie_id = ?
            ORDER BY r.created_at DESC`,
            [movieId]
        );

        return rows;
    }

    async movieExists(movieId, conn = this.#db) {
        const [rows] = await conn.execute(
            'SELECT id FROM movies WHERE id = ? LIMIT 1',
            [movieId]
        );

        return rows.length > 0;
    }

    async userAlreadyReviewed(movieId, userId, conn = this.#db) {
        const [rows] = await conn.execute(
            'SELECT id FROM reviews WHERE movie_id = ? AND user_id = ? LIMIT 1',
            [movieId, userId]
        );

        return rows.length > 0;
    }

    async insert(review, conn = this.#db) {
        const [result] = await conn.execute(
            `INSERT INTO reviews (movie_id, user_id, title, comment, rating)
            VALUES (?, ?, ?, ?, ?)`,
            [review.movie_id, review.user_id, review.title, review.comment, review.rating]
        );

        return result;
    }

    async updateMovieAverageRating(movieId, conn = this.#db) {
        await conn.execute(
            `UPDATE movies
            SET average_rating = (
                SELECT ROUND(AVG(rating), 2)
                FROM reviews
                WHERE movie_id = ?
            )
            WHERE id = ?`,
            [movieId, movieId]
        );
    }
}
