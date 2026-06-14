import { Router } from "express";
import authMiddleware from "../../shared/middleware/authMiddleware.js";
import asignacionesController from "./asignaciones_controller.js";

const router = Router();

router.use(authMiddleware.authenticateUser.bind(authMiddleware));

/**
 * @swagger
 * tags:
 *   name: Asignaciones
 *   description: Asignación de edificios a ayudantes por parte de inspectores
 */

// ─────────────────────────────────────────────────────────────────────────────
// Rutas específicas ANTES de /:id para evitar conflictos de parámetros
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/asignaciones/mis-asignaciones:
 *   get:
 *     summary: Edificios asignados al ayudante autenticado
 *     tags: [Asignaciones]
 *     description: Solo accesible por usuarios con rol **ayudante**.
 *                  Devuelve las asignaciones activas del ayudante autenticado.
 *     responses:
 *       200:
 *         description: Lista de asignaciones activas con datos del edificio e inspector
 *       401:
 *         description: No autorizado
 */
router.get("/mis-asignaciones", asignacionesController.getMisAsignaciones);

/**
 * @swagger
 * /api/v1/asignaciones/inspector:
 *   get:
 *     summary: Asignaciones creadas por el inspector autenticado
 *     tags: [Asignaciones]
 *     description: Solo accesible por usuarios con rol **inspector**.
 *     responses:
 *       200:
 *         description: Lista de asignaciones del inspector
 *       401:
 *         description: No autorizado
 */
router.get("/inspector", asignacionesController.getMisAsignacionesInspector);

/**
 * @swagger
 * /api/v1/asignaciones/edificio/{idEdificio}:
 *   get:
 *     summary: Asignaciones de un edificio específico
 *     tags: [Asignaciones]
 *     parameters:
 *       - in: path
 *         name: idEdificio
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del edificio
 *     responses:
 *       200:
 *         description: Lista de asignaciones del edificio
 *       404:
 *         description: Edificio no encontrado
 */
router.get("/edificio/:idEdificio", asignacionesController.getByEdificio);

// ─────────────────────────────────────────────────────────────────────────────
// CRUD general
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/asignaciones:
 *   get:
 *     summary: Obtener todas las asignaciones (solo administrador)
 *     tags: [Asignaciones]
 *     responses:
 *       200:
 *         description: Lista completa de asignaciones
 *       403:
 *         description: Acceso denegado
 */
router.get("/", asignacionesController.getAll);

/**
 * @swagger
 * /api/v1/asignaciones:
 *   post:
 *     summary: Asignar un edificio a un ayudante
 *     tags: [Asignaciones]
 *     description: >
 *       El inspector autenticado selecciona un edificio e ingresa la cédula
 *       del ayudante. El sistema valida que el usuario exista, esté activo y
 *       tenga rol **ayudante**.
 *       Si el ayudante ya tenía una asignación revocada para ese edificio,
 *       la reactiva automáticamente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_edificio, cedula_ayudante]
 *             properties:
 *               id_edificio:
 *                 type: integer
 *                 example: 5
 *               cedula_ayudante:
 *                 type: string
 *                 example: "1712345678"
 *     responses:
 *       201:
 *         description: Asignación creada (o reactivada)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:            { type: integer }
 *                 id_edificio:   { type: integer }
 *                 id_inspector:  { type: string, format: uuid }
 *                 id_ayudante:   { type: string, format: uuid }
 *                 estado:        { type: string, example: activa }
 *                 created_at:    { type: string, format: date-time }
 *       400:
 *         description: Datos inválidos o ayudante no encontrado
 *       409:
 *         description: La asignación ya existe y está activa
 */
router.post("/", asignacionesController.create);

/**
 * @swagger
 * /api/v1/asignaciones/{id}:
 *   get:
 *     summary: Obtener una asignación por ID
 *     tags: [Asignaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos de la asignación con edificio, inspector y ayudante
 *       404:
 *         description: Asignación no encontrada
 */
router.get("/:id", asignacionesController.getById);

/**
 * @swagger
 * /api/v1/asignaciones/{id}/estado:
 *   patch:
 *     summary: Revocar o reactivar una asignación
 *     tags: [Asignaciones]
 *     description: Solo el inspector que creó la asignación o un administrador puede modificarla.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [estado]
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [activa, revocada]
 *                 example: revocada
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       403:
 *         description: Sin permiso para modificar esta asignación
 *       404:
 *         description: Asignación no encontrada
 */
router.patch("/:id/estado", asignacionesController.cambiarEstado);

/**
 * @swagger
 * /api/v1/asignaciones/{id}:
 *   delete:
 *     summary: Eliminar una asignación permanentemente
 *     tags: [Asignaciones]
 *     description: Solo el inspector que la creó o un administrador puede eliminarla.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asignación eliminada
 *       403:
 *         description: Sin permiso para eliminar esta asignación
 *       404:
 *         description: Asignación no encontrada
 */
router.delete("/:id", asignacionesController.remove);

export default router;
