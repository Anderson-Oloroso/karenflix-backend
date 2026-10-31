import { readFileSync } from 'node:fs';
import swaggerUi from 'swagger-ui-express';
import { API_PREFIX, API_VERSION } from './api.config.js';

const paths = JSON.parse(readFileSync(new URL('./swagger.paths.json', import.meta.url), 'utf8'));

const swaggerSpec = {
    openapi: '3.0.3',
    info: {
        title: 'KarenFlix API',
        version: API_VERSION,
        description: 'API REST de KarenFlix'
    },
    servers: [
        {
            url: API_PREFIX
        }
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            MoviePageResponse: {
                type: 'object',
                required: ['status', 'total', 'page', 'limit', 'totalPages', 'data'],
                properties: {
                    status: { type: 'string', example: 'success' },
                    total: { type: 'integer', minimum: 0 },
                    page: { type: 'integer', minimum: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100 },
                    totalPages: { type: 'integer', minimum: 0 },
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            required: ['id', 'title', 'status'],
                            properties: {
                                id: { type: 'integer' },
                                title: { type: 'string' },
                                description: { type: 'string' },
                                category: { type: 'string' },
                                director: {
                                    type: 'object',
                                    nullable: true,
                                    properties: {
                                        id: { type: 'integer' },
                                        name: { type: 'string' }
                                    }
                                },
                                releaseYear: { type: 'integer' },
                                durationMinutes: { type: 'integer' },
                                ageRating: { type: 'string' },
                                imageUrl: { type: 'string' },
                                bannerUrl: { type: 'string', nullable: true },
                                trailerUrl: { type: 'string', nullable: true },
                                status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
                                averageRating: { type: 'number' },
                                likesCount: { type: 'integer', minimum: 0 },
                                createBy: { type: 'string', nullable: true },
                                createAt: { type: 'string', format: 'date-time' }
                            }
                        }
                    }
                }
            }
        },
        responses: {
            BadRequest: { description: 'Solicitud inválida.' },
            Unauthorized: { description: 'Autenticación requerida o inválida.' },
            Forbidden: { description: 'Permisos insuficientes.' },
            NotFound: { description: 'Recurso no encontrado.' },
            Conflict: { description: 'El recurso ya existe.' },
            InternalServerError: { description: 'Error interno del servidor.' }
        }
    },
    paths
};

export const swaggerDocs = (app) => {
    app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
