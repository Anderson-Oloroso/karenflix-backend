import { Router } from 'express';
import authRouter    from './auth.route.js';
import movieRoutes   from './movie.route.js';
import categoryRouter from './category.route.js';
import reviewRouter  from './review.route.js';
import reviewReactionRouter from './review-reaction.route.js';
import actorRouter from './actor.route.js';
import favoriteRouter from './favorite.route.js';
import movieActorRouter from './movie-actor.route.js';
import userRouter, { userProfileRouter } from './user.route.js';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/auth/profile', userProfileRouter);

/**
 * @swagger
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: Obtener el perfil del usuario autenticado
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario autenticado.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /users/me:
 *   put:
 *     tags: [Users]
 *     summary: Actualizar el perfil del usuario autenticado
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 100
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Perfil actualizado.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
/**
 * @swagger
 * /users/me:
 *   delete:
 *     tags: [Users]
 *     summary: Eliminar la cuenta del usuario autenticado
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cuenta eliminada.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
apiRouter.use('/users/me', userProfileRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/movies', movieRoutes);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/reviews', reviewReactionRouter);
apiRouter.use('/actors', actorRouter);
apiRouter.use('/favorites', favoriteRouter);
apiRouter.use('/movie-actors', movieActorRouter);

// Reseñas anidadas bajo películas: /api/v1/movies/:id/reviews
apiRouter.use('/movies/:id/reviews', reviewRouter);

export default apiRouter;
