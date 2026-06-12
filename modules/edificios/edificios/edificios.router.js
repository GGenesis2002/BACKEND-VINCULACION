import { Router } from "express";
import multer from "multer";
import authMiddleware from "../../shared/middleware/authMiddleware.js";
import edificiosController from "./edificios.controller.js";
import archivosController from "../archivos/archivos.controller.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const uploadFields = upload.fields([
  { name: "foto_edificio", maxCount: 1 },
  { name: "grafico_edificio", maxCount: 1 },
]);

router.use(authMiddleware.authenticateUser.bind(authMiddleware));

/**
 * @swagger
 * tags:
 *   name: Edificios
 *   description: Gestión de edificios evaluados
 */

/**
 * @swagger
 * /api/v1/edificios:
 *   get:
 *     summary: Obtener todos los edificios con inspector y puntuación
 *     tags: [Edificios]
 *     responses:
 *       200:
 *         description: Lista de edificios
 *       401:
 *         description: No autorizado
 */
router.get("/", edificiosController.getAll);

/**
 * @swagger
 * /api/v1/edificios/{id}:
 *   get:
 *     summary: Obtener un edificio por ID
 *     tags: [Edificios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del edificio
 *       404:
 *         description: Edificio no encontrado
 */
router.get("/:id", edificiosController.getById);

/**
 * @swagger
 * /api/v1/edificios:
 *   post:
 *     summary: Crear un nuevo edificio
 *     tags: [Edificios]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [nombre_edificio, direccion, ciudad, codigo_postal, uso_principal, latitud, longitud, numero_pisos, area_total_piso, anio_construccion, anio_codigo, ocupacion, unidades]
 *             properties:
 *               nombre_edificio:
 *                 type: string
 *               direccion:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               codigo_postal:
 *                 type: string
 *               uso_principal:
 *                 type: string
 *               latitud:
 *                 type: number
 *               longitud:
 *                 type: number
 *               numero_pisos:
 *                 type: integer
 *               area_total_piso:
 *                 type: number
 *               anio_construccion:
 *                 type: integer
 *               anio_codigo:
 *                 type: integer
 *               ampliacion:
 *                 type: string
 *                 enum: ["0", "1"]
 *               historico:
 *                 type: string
 *                 enum: ["0", "1"]
 *               albergue:
 *                 type: string
 *                 enum: ["0", "1"]
 *               gubernamental:
 *                 type: string
 *                 enum: ["0", "1"]
 *               ocupacion:
 *                 type: string
 *               unidades:
 *                 type: integer
 *               foto_edificio:
 *                 type: string
 *                 format: binary
 *               grafico_edificio:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Edificio creado
 *       400:
 *         description: Datos inválidos
 */
router.post("/", uploadFields, edificiosController.create);

/**
 * @swagger
 * /api/v1/edificios/{id}:
 *   put:
 *     summary: Actualizar un edificio
 *     tags: [Edificios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_edificio:
 *                 type: string
 *               direccion:
 *                 type: string
 *               foto_edificio:
 *                 type: string
 *                 format: binary
 *               grafico_edificio:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Edificio actualizado
 *       404:
 *         description: Edificio no encontrado
 */
router.put("/:id", uploadFields, edificiosController.update);

/**
 * @swagger
 * /api/v1/edificios/{id}:
 *   delete:
 *     summary: Eliminar un edificio
 *     tags: [Edificios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Edificio eliminado
 *       404:
 *         description: Edificio no encontrado
 */
router.delete("/:id", edificiosController.remove);

/**
 * @swagger
 * /api/v1/edificios/{id}/archivos:
 *   get:
 *     summary: Obtener archivos de un edificio
 *     tags: [Edificios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de archivos
 */
router.get("/:id/archivos", archivosController.getByEdificio);

/**
 * @swagger
 * /api/v1/edificios/{id}/archivos:
 *   post:
 *     summary: Subir archivo a un edificio
 *     tags: [Edificios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               archivo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Archivo subido
 */
router.post("/:id/archivos", upload.single("archivo"), archivosController.upload);

/**
 * @swagger
 * /api/v1/edificios/{id}/archivos/{archivoId}:
 *   delete:
 *     summary: Eliminar archivo de un edificio
 *     tags: [Edificios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: archivoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Archivo eliminado
 */
router.delete("/:id/archivos/:archivoId", archivosController.remove);

export default router;
