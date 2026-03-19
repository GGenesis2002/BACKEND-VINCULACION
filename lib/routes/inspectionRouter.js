import express from "express";
import inspectionController from "../controllers/inspectionController.js";

const inspectionRouter = express.Router();

/**
 * @swagger
 * /inspections:
 *   post:
 *     summary: Guardar una nueva inspección
 *     tags: [Inspecciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_edificio
 *               - id_usuario
 *             properties:
 *               id_edificio:
 *                 type: integer
 *                 example: 1
 *               id_usuario:
 *                 type: integer
 *                 example: 5
 *               puntuacion_final:
 *                 type: number
 *                 example: 87.5
 *               otros_peligros:
 *                 type: object
 *                 example: { "grietas": true, "humedad": false }
 *               estado:
 *                 type: string
 *                 example: APROBADO
 *     responses:
 *       201:
 *         description: Inspección guardada con éxito
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
inspectionRouter.post("/", inspectionController.postInspection);

export default inspectionRouter;
