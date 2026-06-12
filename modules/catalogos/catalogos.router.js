import express from "express";
import catalogosController from "./catalogos.controller.js";
import authMiddleware from "../shared/middleware/authMiddleware.js";

const catalogosRouter = express.Router();
catalogosRouter.use(authMiddleware.authenticateUser.bind(authMiddleware));

/**
 * @swagger
 * /catalogues/by-type/{type}:
 *   get:
 *     summary: Obtiene catálogos por tipo y filtro
 *     tags: [Catálogos]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Tipo de catálogo a buscar
 *         example: TIPO_SUELO
 *       - in: query
 *         name: filter
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtro para buscar en el campo valor
 *         example: roca
 *     responses:
 *       200:
 *         description: Lista de catálogos obtenida exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No se encontraron catálogos
 *       500:
 *         description: Error interno del servidor
 */
catalogosRouter.get("/by-type/:type", catalogosController.getCataloguesByType);

export default catalogosRouter;
