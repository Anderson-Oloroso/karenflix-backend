// El sistema debe registrar en una colección historial cada acción relevante 
// que realice el usuario: registro de reseña, edición o eliminación. 
// Además, debe existir un endpoint donde se pueda consultar su historial de 
// actividades de manera ordenada y filtrada por fecha y tipo de acción.

// El flujo esperado es el siguiente:

// El backend registra automáticamente cada acción en la base de datos.
// Se consume un endpoint que devuelve el historial correspondiente al usuario autenticado.
// El historial debe mostrarse de forma clara con opciones de filtrado básico (por fecha o tipo de acción).

import { Router } from 'express';
import Database from '../config/db.config.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { validationMiddleware } from '../middlewares/validation.middleware.js';
import HistorialController from '../controllers/historial.controller.js';
import HistorialModel from '../models/hitorial.model.js';
import HistorialService from '../services/historial.service.js';
import { historialValidator } from '../validators/historial.validator.js';

const historialModel = new HistorialModel(Database.getPool());
const historialService = new HistorialService(historialModel);
const historialController = new HistorialController(historialService);
const authMiddleware = new AuthMiddleware();
const router = Router();

router.get(
    '/',
    authMiddleware.requireAuth,
    historialValidator,
    validationMiddleware,
    historialController.getMine
);

export default router;