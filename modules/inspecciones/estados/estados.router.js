import { Router } from "express";
import authMiddleware from "../../shared/middleware/authMiddleware.js";
import estadosController from "./estados.controller.js";

const router = Router();
router.use(authMiddleware.authenticateUser.bind(authMiddleware));

/**
 * @swagger
 * tags:
 *   name: Estados Inspección
 *   description: Catálogo de estados del ciclo de vida de una inspección
 */

/**
 * @swagger
 * /api/v1/estados-inspeccion:
 *   get:
 *     summary: Obtener todos los estados de inspección
 *     tags: [Estados Inspección]
 *     responses:
 *       200:
 *         description: Lista de estados activos ordenados
 */
router.get("/", estadosController.getAll);

export default router;
