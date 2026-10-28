import { Router } from 'express';

// ── Infraestructura ───────────────────────────────────────────────────────────
import { pool }     from '../config/db.config.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

// ── Composition Root (Inyección de Dependencias) ──────────────────────────────
import ReviewModel      from '../models/review.model.js';
import ReviewService    from '../services/review.service.js';
import ReviewController from '../controllers/review.controller.js';

// ── Validación ────────────────────────────────────────────────────────────────
import reviewValidator      from '../validators/review.validator.js';
import validationMiddleware from '../middlewares/validation.middleware.js';

// ─── Ensamblaje de dependencias ───────────────────────────────────────────────
//  ReviewModel recibe el pool por DI; ReviewService recibe modelo + pool para
//  poder gestionar conexiones dedicadas en transacciones ACID.
const reviewModel      = new ReviewModel(pool);
const reviewService    = new ReviewService(reviewModel, pool);
const reviewController = new ReviewController(reviewService);

// ─── Instancia del middleware de autenticación ────────────────────────────────
const auth = new AuthMiddleware();

const router = Router({ mergeParams: true }); // mergeParams expone :id de la ruta padre

// ─────────────────────────────────────────────────────────────────────────────
// Endpoints
//   Montado en: /api/v1/movies/:id/reviews  (ver src/routes/index.js)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/movies/:id/reviews
 * Lista todas las reseñas de una película.
 * Requiere autenticación JWT.
 */
router.get('/', auth.requireAuth, reviewController.getByMovieId);

/**
 * POST /api/v1/movies/:id/reviews
 * Crea una reseña para la película indicada.
 * Requiere autenticación JWT + validación de cuerpo.
 */
router.post(
    '/',
    auth.requireAuth,
    reviewValidator,
    validationMiddleware,
    reviewController.create
);

export default router;
