export default class ReviewReactionController {
    #reviewReactionService;

    constructor(reviewReactionService) {
        if (!reviewReactionService) {
            throw new Error('reviewReactionService es requerido en ReviewReactionController');
        }
        this.#reviewReactionService = reviewReactionService;
        this.toggle = this.toggle.bind(this);
    }

    async toggle(req, res, next) {
        try {
            const reviewId = Number(req.params.id);
            const userId = req.user?.id ?? req.user?.sub;
            const { reaction_type: reactionType } = req.body;
            const result = await this.#reviewReactionService.toggle(reviewId, userId, reactionType);

            return res.status(200).json({
                status: 'success',
                message: result.toggledOff
                    ? 'Reacción eliminada correctamente.'
                    : 'Reacción registrada correctamente.',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
