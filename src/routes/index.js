import { Router } from 'express';
import authRouter    from './auth.route.js';
import movieRoutes   from './movie.route.js';
import categoryRouter from './category.route.js';
import reviewRouter  from './review.route.js';
import reviewReactionRouter from './review-reaction.route.js';
import actorRouter from './actor.route.js';

const apiRouter = Router();

apiRouter.use('/auth',       authRouter);
apiRouter.use('/movies',     movieRoutes);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/reviews', reviewReactionRouter);
apiRouter.use('/actors', actorRouter);

// Reseñas anidadas bajo películas: /api/v1/movies/:id/reviews
apiRouter.use('/movies/:id/reviews', reviewRouter);

export default apiRouter;
