import express from "express";
import catalogueController from "../controllers/catalogueController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const catalogueRouter = express.Router();
catalogueRouter.use(authMiddleware.authenticateUser.bind(authMiddleware));
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_catalogo:
 *                     type: integer
 *                     example: 1
 *                   tipo:
 *                     type: string
 *                     example: TIPO_SUELO
 *                   codigo:
 *                     type: string
 *                     example: TS001
 *                   valor:
 *                     type: string
 *                     example: Roca sedimentaria
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No se encontraron catálogos para el tipo especificado
 *       500:
 *         description: Error interno del servidor
 */
catalogueRouter.get("/by-type/:type", catalogueController.getCataloguesByType);

export default catalogueRouter;
