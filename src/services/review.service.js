import AppError from '../utils/appError.util.js';
import ReviewDTO from '../dtos/review.dto.js';

export default class ReviewService {
    #reviewModel;
    #pool;

    constructor(reviewModel) {
        this.#reviewModel = reviewModel;

    }

    async create(movieId, userId, reviewData) {
        const movieExists = await this.#reviewModel.movieExists(movieId);
        if (!movieExists) {
            throw AppError.notFound(`La película con id ${movieId} no existe.`);
        }

        const alreadyReviewed = await this.#reviewModel.userAlreadyReviewed(movieId, userId);
        if (alreadyReviewed) {
            throw AppError.conflict('Ya publicaste una reseña para esta película.');
        }

        // La base de datos mediante el trigger trg_reviews_after_insert recalcula average_rating de forma atómica
        const result = await this.#reviewModel.insert({
            movie_id: movieId,
            user_id: userId,
            ...reviewData
        });

        return { id: result.insertId };
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
