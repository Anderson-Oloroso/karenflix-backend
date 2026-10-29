import AppError from '../utils/appError.util.js';
import ReviewReactionDTO from '../dtos/review-reaction.dto.js';

export default class ReviewReactionService {
    #reviewReactionModel;
    #pool;

    constructor(reviewReactionModel, pool) {
        if (!reviewReactionModel || !pool) {
            throw new Error('reviewReactionModel y pool son requeridos en ReviewReactionService');
        }
        this.#reviewReactionModel = reviewReactionModel;
        this.#pool = pool;
    }

    async toggle(reviewId, userId, reactionType) {
        const connection = await this.#pool.getConnection();
        let transactionStarted = false;

        try {
            await connection.beginTransaction();
            transactionStarted = true;

            const review = await this.#reviewReactionModel.getReviewById(reviewId, connection);

            if (!review) {
                throw AppError.notFound(`La reseña con id ${reviewId} no existe.`);
            }

            if (Number(review.user_id) === Number(userId)) {
                throw AppError.badRequest('No puedes reaccionar a tu propia reseña.');
            }

            const currentReaction = await this.#reviewReactionModel.getByReviewAndUser(
                reviewId,
                userId,
                connection
            );
            let toggledOff = false;

            if (!currentReaction) {
                await this.#reviewReactionModel.create({
                    review_id: reviewId,
                    user_id: userId,
                    reaction_type: reactionType
                }, connection);
            } else if (currentReaction.reaction_type === reactionType) {
                await this.#reviewReactionModel.delete(currentReaction.id, connection);
                toggledOff = true;
            } else {
                await this.#reviewReactionModel.update(currentReaction.id, reactionType, connection);
            }

            const counts = await this.#reviewReactionModel.getCounts(reviewId, connection);
            await connection.commit();
            transactionStarted = false;

            return new ReviewReactionDTO(
                reviewId,
                toggledOff ? null : reactionType,
                counts,
                toggledOff
            ).data;
        } catch (error) {
            if (transactionStarted) {
                await connection.rollback();
            }
            throw error;
        } finally {
            connection.release();
        }
    }
}
