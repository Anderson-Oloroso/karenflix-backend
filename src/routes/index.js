import { Router } from 'express';
import authRouter from './auth.route.js';
import movieRoutes from './movie.route.js';
import categoryRouter from './category.route.js';
import reviewReactionRouter from './review-reaction.route.js';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/movies', movieRoutes);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/reviews', reviewReactionRouter);

export default apiRouter;
