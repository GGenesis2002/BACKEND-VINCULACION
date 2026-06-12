import { Router } from "express";
import authMiddleware from "../../shared/middleware/authMiddleware.js";
import permisosController from "./permisos.controller.js";

const router = Router();

router.use(authMiddleware.authenticateUser.bind(authMiddleware));

/**
 * @swagger
 * tags:
 *   name: Permisos
 *   description: Módulos, opciones, acciones y permisos por rol
 */

/**
 * @swagger
 * /api/v1/permisos/modulos:
 *   get:
 *     summary: Obtener todos los módulos del sistema
 *     tags: [Permisos]
 *     responses:
 *       200:
 *         description: Lista de módulos activos
 *       401:
 *         description: No autorizado
 */
router.get("/modulos", permisosController.getModulos);

/**
 * @swagger
 * /api/v1/permisos/opciones:
 *   get:
 *     summary: Obtener todas las opciones del sistema
 *     tags: [Permisos]
 *     responses:
 *       200:
 *         description: Lista de opciones activas
 *       401:
 *         description: No autorizado
 */
router.get("/opciones", permisosController.getOpciones);

/**
 * @swagger
 * /api/v1/permisos/acciones:
 *   get:
 *     summary: Obtener todas las acciones disponibles
 *     tags: [Permisos]
 *     responses:
 *       200:
 *         description: Lista de acciones
 *       401:
 *         description: No autorizado
 */
router.get("/acciones", permisosController.getAcciones);

/**
 * @swagger
 * /api/v1/permisos/rol/{idRol}:
 *   get:
 *     summary: Obtener permisos asignados a un rol
 *     tags: [Permisos]
 *     parameters:
 *       - in: path
 *         name: idRol
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Permisos del rol (opciones y acciones habilitadas)
 *       401:
 *         description: No autorizado
 */
router.get("/rol/:idRol", permisosController.getPermisosByRol);

export default router;
