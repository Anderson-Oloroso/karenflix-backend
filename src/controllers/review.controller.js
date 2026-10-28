/**
 * ReviewController
 *
 * Maneja las peticiones HTTP del módulo de reseñas.
 *
 * Reglas estrictas:
 *  - Todos los métodos tienen la firma async (req, res, next).
 *  - La lógica se envuelve en try/catch y los errores se delegan con next(error).
 *  - Nunca se usa res.status(4xx) directamente en el bloque catch.
 */
export default class ReviewController {
    /** @type {import('../services/review.service.js').default} */
    #reviewService;

    /**
     * @param {import('../services/review.service.js').default} reviewService
     */
    constructor(reviewService) {
        this.#reviewService = reviewService;
        // Binding explícito para preservar el contexto al pasar como callback de Express
        this.create       = this.create.bind(this);
        this.getByMovieId = this.getByMovieId.bind(this);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/v1/movies/:id/reviews
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Crea una nueva reseña para la película indicada en `:id`.
     * Requiere autenticación JWT.
     */
    async create(req, res, next) {
        try {
            const movieId = Number(req.params.id);
            const userId  = req.user?.id ?? req.user?.sub;
            const { title, comment, rating } = req.body;

            const result = await this.#reviewService.create(movieId, userId, {
                title,
                comment,
                rating,
            });

            return res.status(201).json({
                status:  'success',
                message: 'Reseña publicada correctamente.',
                data:    result,
            });
        } catch (error) {
            next(error);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/v1/movies/:id/reviews
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Retorna todas las reseñas de la película indicada en `:id`.
     * Requiere autenticación JWT.
     */
    async getByMovieId(req, res, next) {
        try {
            const movieId = Number(req.params.id);
            const reviews = await this.#reviewService.getByMovieId(movieId);

            return res.status(200).json({
                status: 'success',
                total:  reviews.length,
                data:   reviews,
            });
        } catch (error) {
            next(error);
        }
    }
}
