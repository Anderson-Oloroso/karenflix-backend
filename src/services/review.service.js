import AppError from '../utils/appError.util.js';
import ReviewDTO from '../dtos/review.dto.js';

export default class ReviewService {
    #reviewModel;
    #pool;

    constructor(reviewModel, pool) {
        this.#reviewModel = reviewModel;
        this.#pool = pool;
    }

    async create(movieId, userId, reviewData) {
        const connection = await this.#pool.getConnection();

        try {
            await connection.beginTransaction();

            const movieExists = await this.#reviewModel.movieExists(movieId, connection);

            if (!movieExists) {
                throw AppError.notFound(`La película con id ${movieId} no existe.`);
            }

            const alreadyReviewed = await this.#reviewModel.userAlreadyReviewed(movieId, userId, connection);

            if (alreadyReviewed) {
                throw AppError.conflict('Ya publicaste una reseña para esta película.');
            }

            const result = await this.#reviewModel.insert(
                { movie_id: movieId, user_id: userId, ...reviewData },
                connection
            );

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

    async getByMovieId(movieId) {
        const movieExists = await this.#reviewModel.movieExists(movieId);

        if (!movieExists) {
            throw AppError.notFound(`La película con id ${movieId} no existe.`);
        }

        const reviews = await this.#reviewModel.getByMovieId(movieId);

        return ReviewDTO.fromArray(reviews);
    }
}
