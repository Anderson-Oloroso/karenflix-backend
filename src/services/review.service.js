import AppError from '../utils/appError.util.js';
import ReviewDTO from '../dtos/review.dto.js';

/**
 * ReviewService
 *
 * Orquesta la lógica de negocio del módulo de reseñas.
 *
 * El `pool` se inyecta como dependencia separada del modelo para poder
 * obtener conexiones dedicadas y controlar transacciones ACID explícitas.
 */
export default class ReviewService {
    /** @type {import('../models/review.model.js').default} */
    #reviewModel;

    /** @type {import('mysql2/promise').Pool} */
    #pool;

    /**
     * @param {import('../models/review.model.js').default} reviewModel
     * @param {import('mysql2/promise').Pool} pool
     */
    constructor(reviewModel, pool) {
        this.#reviewModel = reviewModel;
        this.#pool = pool;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Caso de uso: Crear reseña (transaccional ACID)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Crea una reseña dentro de una transacción ACID explícita.
     * Flujo:
     *  1. Verifica existencia de la película (con bloqueo de lectura).
     *  2. Verifica que el usuario no haya reseñado ya la misma película.
     *  3. Inserta la reseña.
     *  4. Recalcula el promedio ponderado de ratings de la película.
     *  5. Commit / Rollback automático.
     *
     * @param {number} movieId
     * @param {number} userId
     * @param {{ title: string, comment: string, rating: number }} reviewData
     * @returns {Promise<{ id: number }>}
     */
    async create(movieId, userId, reviewData) {
        const connection = await this.#pool.getConnection();

        try {
            await connection.beginTransaction();

            // 1. Verificar existencia de la película
            const movieExists = await this.#reviewModel.movieExists(movieId, connection);
            if (!movieExists) {
                throw AppError.notFound(`La película con id ${movieId} no existe.`);
            }

            // 2. Evitar reseñas duplicadas del mismo usuario para la misma película
            const alreadyReviewed = await this.#reviewModel.userAlreadyReviewed(
                movieId,
                userId,
                connection
            );
            if (alreadyReviewed) {
                throw AppError.conflict('Ya publicaste una reseña para esta película.');
            }

            // 3. Insertar la reseña
            const result = await this.#reviewModel.insert(
                { movie_id: movieId, user_id: userId, ...reviewData },
                connection
            );

            // 4. Actualizar el promedio ponderado de la película
            await this.#reviewModel.updateMovieAverageRating(movieId, connection);

            await connection.commit();

            return { id: result.insertId };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Caso de uso: Listar reseñas por película
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Retorna todas las reseñas de una película sanitizadas como DTOs.
     * @param {number} movieId
     * @returns {Promise<object[]>}
     */
    async getByMovieId(movieId) {
        // Verificar existencia de la película antes de consultar reseñas
        const movieExists = await this.#reviewModel.movieExists(movieId);
        if (!movieExists) {
            throw AppError.notFound(`La película con id ${movieId} no existe.`);
        }

        const reviews = await this.#reviewModel.getByMovieId(movieId);
        return ReviewDTO.fromArray(reviews);
    }
}
