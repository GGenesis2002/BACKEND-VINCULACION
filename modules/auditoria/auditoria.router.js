import { Router } from "express";
import authMiddleware from "../shared/middleware/authMiddleware.js";
import auditoriaController from "./auditoria.controller.js";

const router = Router();

router.use(authMiddleware.authenticateUser.bind(authMiddleware));
router.use(authMiddleware.requireAdmin.bind(authMiddleware));

/**
 * @swagger
 * tags:
 *   name: Auditoría
 *   description: Historial de acciones del sistema (solo administradores)
 */

/**
 * @swagger
 * /api/v1/auditoria:
 *   get:
 *     summary: Obtener historial de auditoría con filtros
 *     tags: [Auditoría]
 *     parameters:
 *       - in: query
 *         name: tabla
 *         schema:
 *           type: string
 *         description: Filtrar por tabla afectada
 *       - in: query
 *         name: idUsuario
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por usuario
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha inicio (ISO 8601)
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha fin (ISO 8601)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Lista de registros de auditoría con nombre de usuario
 *       403:
 *         description: Acceso denegado
 */
router.get("/", auditoriaController.getAll);

/**
 * @swagger
 * /api/v1/auditoria/tablas:
 *   get:
 *     summary: Obtener lista de tablas que tienen registros de auditoría
 *     tags: [Auditoría]
 *     responses:
 *       200:
 *         description: Lista de tablas únicas
 */
router.get("/tablas", auditoriaController.getTablas);

/**
 * @swagger
 * /api/v1/auditoria/{id}:
 *   get:
 *     summary: Obtener registro de auditoría por ID
 *     tags: [Auditoría]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro de auditoría
 *       404:
 *         description: Registro no encontrado
 */
router.get("/:id", auditoriaController.getById);

export default router;
