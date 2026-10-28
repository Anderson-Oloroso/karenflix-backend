import { Router } from "express";
import authRouter from "./auth.route.js";
import movieRoutes from './movie.route.js';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/movies', movieRoutes);

export default apiRouter;
