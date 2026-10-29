import swaggerUi from 'swagger-ui-express';

const swaggerSpec = {
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
    paths: {
        '/': {
            get: {
                summary: 'Verificar el estado de la API',
                responses: {
                    200: {
                        description: 'La API está funcionando correctamente.',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: {
                                            type: 'string',
                                            example: 'success'
                                        },
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
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    }
};

export function swaggerDocs(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

export default swaggerSpec;