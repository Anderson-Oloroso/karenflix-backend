import { Router } from 'express';
import authRouter from './auth.route.js';
import movieRoutes from './movie.route.js';
import categoryRouter from './category.route.js';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/movies', movieRoutes);
apiRouter.use('/categories', categoryRouter);

export default apiRouter;
