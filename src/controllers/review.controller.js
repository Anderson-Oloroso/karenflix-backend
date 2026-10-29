export default class ReviewController {
    #reviewService;

    constructor(reviewService) {
        this.#reviewService = reviewService;
        this.create = this.create.bind(this);
        this.getByMovieId = this.getByMovieId.bind(this);
    }

    async create(req, res, next) {
        try {
            const movieId = Number(req.params.id);
            const userId = req.user?.id ?? req.user?.sub;
            const { title, comment, rating } = req.body;

            const result = await this.#reviewService.create(movieId, userId, { title, comment, rating });

            return res.status(201).json({
                status: 'success',
                message: 'Reseña publicada correctamente.',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getByMovieId(req, res, next) {
        try {
            const movieId = Number(req.params.id);
            const reviews = await this.#reviewService.getByMovieId(movieId);

            return res.status(200).json({
                status: 'success',
                total: reviews.length,
                data: reviews
            });
        } catch (error) {
            next(error);
        }
    }
}
