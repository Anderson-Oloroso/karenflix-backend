import { query } from 'express-validator';

const dateOnly = /^\d{4}-\d{2}-\d{2}$/;

export const historialValidator = [
    query('action')
        .optional()
        .isIn(['create', 'update', 'delete'])
        .withMessage('El filtro action debe ser create, update o delete.')
];
