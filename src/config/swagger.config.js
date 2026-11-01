import { readFileSync } from 'node:fs';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';
import { API_PREFIX, API_VERSION } from './api.config.js';

const PORT = process.env.PORT || 4000;
const paths = JSON.parse(readFileSync(new URL('./swagger.paths.json', import.meta.url), 'utf8'));

const swaggerSpec = {
    openapi: '3.0.3',
    info: {
        title: 'KarenFlix API',
        version: API_VERSION,
        description: 'Documentación interactiva de la API REST de KarenFlix.'
    },
    servers: [
        {
            url: `http://localhost:${PORT}${API_PREFIX}`,
            description: 'Servidor local'
        }
    ],
    tags: [
        { name: 'Health' },
        { name: 'Auth' },
        { name: 'Categories' },
        { name: 'Movies' },
        { name: 'Directors' },
        { name: 'Reviews' },
        { name: 'Reactions' },
        { name: 'Actors' },
        { name: 'Favorites' },
        { name: 'Movie Actors' },
        { name: 'Users' }
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
            ErrorResponse: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'Fail' },
                    message: { type: 'string', example: 'Error de validación' },
                    mensaje: { type: 'string', example: 'Solicitud inválida' },
                    errors: {
                        type: 'array',
                        items: { type: 'object' }
                    },
                    errores: { type: 'object', nullable: true },
                    metodo: { type: 'string' },
                    url: { type: 'string' }
                }
            },
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
                                imageUrl: { type: 'string', nullable: true },
                                bannerUrl: { type: 'string', nullable: true },
                                trailerUrl: { type: 'string', nullable: true },
                                status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
                                averageRating: { type: 'number' },
                                rankingScore: { type: 'number', nullable: true },
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
            BadRequest: {
                description: 'La solicitud contiene datos inválidos.',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ErrorResponse' }
                    }
                }
            },
            Unauthorized: {
                description: 'Se requiere autenticación JWT válida.',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ErrorResponse' }
                    }
                }
            },
            Forbidden: {
                description: 'El usuario autenticado no tiene permisos suficientes.',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ErrorResponse' }
                    }
                }
            },
            NotFound: {
                description: 'No se encontró el recurso solicitado.',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ErrorResponse' }
                    }
                }
            },
            Conflict: {
                description: 'La operación entra en conflicto con un recurso existente.',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ErrorResponse' }
                    }
                }
            },
            InternalServerError: {
                description: 'Se produjo un error interno del servidor.'
            }
        }
    },
    paths
};

export function swaggerDocs(app) {
    app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

export default swaggerSpec;
