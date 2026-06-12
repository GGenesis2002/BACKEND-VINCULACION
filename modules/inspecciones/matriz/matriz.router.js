import { Router } from "express";
import authMiddleware from "../../shared/middleware/authMiddleware.js";
import matrizController from "./matriz.controller.js";

const router = Router();
router.use(authMiddleware.authenticateUser.bind(authMiddleware));

/**
 * @swagger
 * tags:
 *   name: Matriz de Puntuación
 *   description: Criterios de evaluación sísmica
 */

/**
 * @swagger
 * /api/v1/matriz-puntuacion:
 *   get:
 *     summary: Obtener todos los criterios de la matriz
 *     tags: [Matriz de Puntuación]
 *     responses:
 *       200:
 *         description: Lista de criterios activos
 */
router.get("/", matrizController.getAll);

/**
 * @swagger
 * /api/v1/matriz-puntuacion/{id}:
 *   get:
 *     summary: Obtener criterio por ID
 *     tags: [Matriz de Puntuación]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Criterio encontrado
 */
router.get("/:id", matrizController.getById);

export default router;
