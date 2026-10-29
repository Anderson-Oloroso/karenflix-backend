import { body, param } from 'express-validator';

const reviewReactionValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID de la reseña debe ser un número entero positivo'),
    body('reaction_type')
        .isIn(['like', 'dislike'])
        .withMessage('El tipo de reacción debe ser like o dislike')
];

export default reviewReactionValidator;
