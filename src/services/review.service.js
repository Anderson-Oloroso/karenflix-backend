import AppError from '../utils/appError.util.js';
import ReviewDTO from '../dtos/review.dto.js';

export default class ReviewService {
    #reviewModel;
    #pool;

    constructor(reviewModel, pool) {
        if (!reviewModel || !pool) {
            throw new Error('reviewModel y pool son requeridos en ReviewService');
        }
        this.#reviewModel = reviewModel;
        this.#pool = pool;
    }

    async create(movieId, userId, reviewData) {
        return this.#withTransaction(async connection => {
            const movieExists = await this.#reviewModel.movieExists(movieId, connection);
            if (!movieExists) {
                throw AppError.notFound(`La película con id ${movieId} no existe o no está aprobada.`);
            }

            const alreadyReviewed = await this.#reviewModel.userAlreadyReviewed(movieId, userId, connection);
            if (alreadyReviewed) {
                throw AppError.conflict('Ya publicaste una reseña para esta película.');
            }

            try {
                const result = await this.#reviewModel.insert({
                    movie_id: movieId,
                    user_id: userId,
                    ...reviewData
                }, connection);
                return { id: result.insertId };
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    throw AppError.conflict('Ya publicaste una reseña para esta película.');
                }
                throw error;
            }
        });
    }

    async getByMovieId(movieId) {
        const movieExists = await this.#reviewModel.movieExists(movieId);
        if (!movieExists) {
            throw AppError.notFound(`La película con id ${movieId} no existe o no está aprobada.`);
        }

        const reviews = await this.#reviewModel.getByMovieId(movieId);
        return ReviewDTO.fromArray(reviews);
    }

    async update(movieId, reviewId, userId, reviewData) {
        return this.#withTransaction(async connection => {
            const review = await this.#reviewModel.getByIdForUpdate(reviewId, connection);
            this.#assertReviewOwner(review, movieId, userId);
            await this.#reviewModel.updateById(reviewId, reviewData, connection);
            return { id: Number(reviewId) };
        });
    }

    async delete(movieId, reviewId, userId) {
        return this.#withTransaction(async connection => {
            const review = await this.#reviewModel.getByIdForUpdate(reviewId, connection);
            this.#assertReviewOwner(review, movieId, userId);
            await this.#reviewModel.deleteById(reviewId, connection);
            return { id: Number(reviewId) };
        });
    }

    #assertReviewOwner(review, movieId, userId) {
        if (!review || Number(review.movie_id) !== Number(movieId)) {
            throw AppError.notFound('No se encontró la reseña para esta película.');
        }
        if (Number(review.user_id) !== Number(userId)) {
            throw AppError.forbidden('Solo puedes modificar o eliminar tus propias reseñas.');
        }
    }

    async #withTransaction(operation) {
        const connection = await this.#pool.getConnection();
        let transactionStarted = false;

        try {
            await connection.beginTransaction();
            transactionStarted = true;
            const result = await operation(connection);
            await connection.commit();
            transactionStarted = false;
            return result;
        } catch (error) {
            if (transactionStarted) {
                try {
                    await connection.rollback();
                } catch (rollbackError) {
                    throw new AggregateError(
                        [error, rollbackError],
                        'La operación falló y no se pudo revertir la transacción'
                    );
                }
            }
            throw error;
        } finally {
            connection.release();
        }
    }
}
