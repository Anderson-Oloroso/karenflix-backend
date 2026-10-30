import { readFileSync } from 'node:fs';
import swaggerUi from 'swagger-ui-express';

const paths = JSON.parse(readFileSync(new URL('./swagger.paths.json', import.meta.url), 'utf8'));

const swaggerSpec = {
    openapi: '3.0.3',
    info: {
        title: 'KarenFlix API',
        version: '1.0.0',
        description: 'API REST de KarenFlix'
    },
    servers: [
        {
            url: process.env.API_PREFIX || '/api/v1'
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
