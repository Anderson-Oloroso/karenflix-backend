/**
 * ReviewModel
 *
 * Responsabilidad única: acceso a datos de la tabla `reviews`.
 *
 * Inyección de Dependencias: el pool (o una conexión dedicada) se
 * recibe por constructor. NUNCA se importa globalmente.
 */
export default class ReviewModel {
    /** @type {import('mysql2/promise').Pool | import('mysql2/promise').Connection} */
    #db;

    /**
     * @param {import('mysql2/promise').Pool} db
     *   Instancia del pool de conexiones inyectada desde el Composition Root.
     */
    constructor(db) {
        this.#db = db;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Métodos de lectura (usan el pool directamente)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Devuelve todas las reseñas de una película junto con el username del autor.
     * @param {number} movieId
     * @returns {Promise<object[]>}
     */
    async getByMovieId(movieId) {
        const [rows] = await this.#db.query(
            `SELECT
                r.id,
                r.movie_id,
                u.username,
                r.title,
                r.comment,
                r.rating,
                r.created_at
             FROM reviews r
             INNER JOIN users u ON u.id = r.user_id
             WHERE r.movie_id = ?
             ORDER BY r.created_at DESC`,
            [movieId]
        );
        return rows;
    }

    /**
     * Verifica si la película existe en la base de datos.
     * Acepta tanto el pool como una conexión de transacción.
     * @param {number} movieId
     * @param {import('mysql2/promise').Connection} [conn] - conexión de transacción (opcional)
     * @returns {Promise<boolean>}
     */
    async movieExists(movieId, conn) {
        const executor = conn ?? this.#db;
        const [rows] = await executor.execute(
            `SELECT id FROM movies WHERE id = ? LIMIT 1`,
            [movieId]
        );
        return rows.length > 0;
    }

    /**
     * Verifica si el usuario ya publicó una reseña para esa película.
     * @param {number} movieId
     * @param {number} userId
     * @param {import('mysql2/promise').Connection} conn - conexión de transacción
     * @returns {Promise<boolean>}
     */
    async userAlreadyReviewed(movieId, userId, conn) {
        const [rows] = await conn.execute(
            `SELECT id FROM reviews WHERE movie_id = ? AND user_id = ? LIMIT 1`,
            [movieId, userId]
        );
        return rows.length > 0;
    }

    /**
     * Inserta una nueva reseña dentro de una transacción activa.
     * @param {{ movie_id: number, user_id: number, title: string, comment: string, rating: number }} review
     * @param {import('mysql2/promise').Connection} conn - conexión de transacción
     * @returns {Promise<import('mysql2/promise').ResultSetHeader>}
     */
    async insert(review, conn) {
        const [result] = await conn.execute(
            `INSERT INTO reviews (movie_id, user_id, title, comment, rating)
             VALUES (?, ?, ?, ?, ?)`,
            [review.movie_id, review.user_id, review.title, review.comment, review.rating]
        );
        return result;
    }

    /**
     * Recalcula y persiste el promedio ponderado de ratings para una película.
     * Usa AVG(rating) directamente sobre la tabla reviews para garantizar
     * consistencia ACID dentro de la misma transacción.
     * @param {number} movieId
     * @param {import('mysql2/promise').Connection} conn - conexión de transacción
     * @returns {Promise<void>}
     */
    async updateMovieAverageRating(movieId, conn) {
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
