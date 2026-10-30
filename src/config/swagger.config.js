import { readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const configDirectory = dirname(fileURLToPath(import.meta.url));
const routeFiles = readdirSync(resolve(configDirectory, '../routes'))
    .filter(file => file.endsWith('.js'))
    .map(file => resolve(configDirectory, '../routes', file));

const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'KarenFlix API',
            description: 'Documentación interactiva de la API REST de KarenFlix.',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:4000/api/v1',
                description: 'Servidor local'
            }
        ],
        tags: [
            { name: 'Health' },
            { name: 'Auth' },
            { name: 'Categories' },
            { name: 'Movies' },
            { name: 'Reviews' },
            { name: 'Reactions' },
            { name: 'Actors' },
            { name: 'Favorites' },
            { name: 'Movie Actors' },
            { name: 'Users' }
        ],
        paths: {
            '/': {
                get: {
                    tags: ['Health'],
                    summary: 'Verificar el estado de la API',
                    responses: {
                        200: {
                            description: 'La API está funcionando correctamente.',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            status: { type: 'string', example: 'success' },
                                            message: {
                                                type: 'string',
                                                example: 'karenflix API funcionando correctamente...'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
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
                }
            }
        }
    },
    apis: routeFiles
});

export function swaggerDocs(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

export default swaggerSpec;