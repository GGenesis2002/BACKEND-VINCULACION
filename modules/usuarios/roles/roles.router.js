import { Router } from "express";
import authMiddleware from "../../shared/middleware/authMiddleware.js";
import rolesController from "./roles.controller.js";

const router = Router();

router.use(authMiddleware.authenticateUser.bind(authMiddleware));

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Gestión de roles y asignación a usuarios
 */

/**
 * @swagger
 * /api/v1/roles:
 *   get:
 *     summary: Obtener todos los roles activos
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles
 *       401:
 *         description: No autorizado
 */
router.get("/", rolesController.getAll);

/**
 * @swagger
 * /api/v1/roles/usuario/{idUsuario}:
 *   get:
 *     summary: Obtener roles asignados a un usuario
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Roles del usuario
 *       401:
 *         description: No autorizado
 */
router.get("/usuario/:idUsuario", rolesController.getByUsuario);

/**
 * @swagger
 * /api/v1/roles/usuario/{idUsuario}/asignar:
 *   post:
 *     summary: Asignar un rol a un usuario (solo administradores)
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idRol]
 *             properties:
 *               idRol:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Rol asignado
 *       403:
 *         description: Acceso denegado
 */
router.post(
  "/usuario/:idUsuario/asignar",
  authMiddleware.requireAdmin.bind(authMiddleware),
  rolesController.assignRol
);

/**
 * @swagger
 * /api/v1/roles/usuario/{idUsuario}/remover:
 *   delete:
 *     summary: Remover un rol de un usuario (solo administradores)
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idRol]
 *             properties:
 *               idRol:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Rol removido
 *       403:
 *         description: Acceso denegado
 */
router.delete(
  "/usuario/:idUsuario/remover",
  authMiddleware.requireAdmin.bind(authMiddleware),
  rolesController.removeRol
);

export default router;
