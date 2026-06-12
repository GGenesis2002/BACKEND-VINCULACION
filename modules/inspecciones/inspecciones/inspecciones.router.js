import { Router } from "express";
import multer from "multer";
import authMiddleware from "../../shared/middleware/authMiddleware.js";
import inspeccionesController from "./inspecciones.controller.js";
import resultadosController from "../resultados/resultados.controller.js";
import comentariosController from "../comentarios/comentarios.controller.js";
import archivosController from "../archivos/archivos.controller.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware.authenticateUser.bind(authMiddleware));

/**
 * @swagger
 * tags:
 *   name: Inspecciones
 *   description: Gestión de inspecciones sísmicas
 */

/**
 * @swagger
 * /api/v1/inspecciones:
 *   get:
 *     summary: Obtener todas las inspecciones
 *     tags: [Inspecciones]
 *     responses:
 *       200:
 *         description: Lista de inspecciones con edificio e inspector
 */
router.get("/", inspeccionesController.getAll);

/**
 * @swagger
 * /api/v1/inspecciones/edificio/{idEdificio}:
 *   get:
 *     summary: Obtener inspecciones de un edificio
 *     tags: [Inspecciones]
 *     parameters:
 *       - in: path
 *         name: idEdificio
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de inspecciones del edificio
 */
router.get("/edificio/:idEdificio", inspeccionesController.getByEdificio);

/**
 * @swagger
 * /api/v1/inspecciones/{id}:
 *   get:
 *     summary: Obtener inspección por ID
 *     tags: [Inspecciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos de la inspección
 *       404:
 *         description: Inspección no encontrada
 */
router.get("/:id", inspeccionesController.getById);

/**
 * @swagger
 * /api/v1/inspecciones:
 *   post:
 *     summary: Crear una nueva inspección
 *     tags: [Inspecciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_edificio, id_usuario]
 *             properties:
 *               id_edificio:
 *                 type: integer
 *               id_usuario:
 *                 type: string
 *                 format: uuid
 *               estado:
 *                 type: string
 *                 example: pendiente
 *               puntuacion_final:
 *                 type: number
 *               observaciones_generales:
 *                 type: string
 *               otros_peligros:
 *                 type: object
 *     responses:
 *       201:
 *         description: Inspección creada
 */
router.post("/", inspeccionesController.create);

/**
 * @swagger
 * /api/v1/inspecciones/{id}:
 *   put:
 *     summary: Actualizar inspección
 *     tags: [Inspecciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Inspección actualizada
 */
router.put("/:id", inspeccionesController.update);

/**
 * @swagger
 * /api/v1/inspecciones/{id}/estado:
 *   patch:
 *     summary: Cambiar estado de una inspección
 *     tags: [Inspecciones]
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
 *                 example: completada
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch("/:id/estado", inspeccionesController.cambiarEstado);

/**
 * @swagger
 * /api/v1/inspecciones/{id}/resultados:
 *   get:
 *     summary: Obtener resultados de una inspección
 *     tags: [Inspecciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resultados con criterios de la matriz
 */
router.get("/:id/resultados", resultadosController.getByInspeccion);

/**
 * @swagger
 * /api/v1/inspecciones/{id}/resultados:
 *   post:
 *     summary: Guardar resultados en bulk para una inspección
 *     tags: [Inspecciones]
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
 *             properties:
 *               resultados:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_criterio:
 *                       type: integer
 *                     valor_obtenido:
 *                       type: number
 *                     peso_aplicado:
 *                       type: number
 *                     comentario_criterio:
 *                       type: string
 *     responses:
 *       201:
 *         description: Resultados guardados
 */
router.post("/:id/resultados", resultadosController.saveBulk);

/**
 * @swagger
 * /api/v1/inspecciones/{id}/resultados/{idResultado}:
 *   put:
 *     summary: Actualizar un resultado
 *     tags: [Inspecciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idResultado
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resultado actualizado
 */
router.put("/:id/resultados/:idResultado", resultadosController.update);

/**
 * @swagger
 * /api/v1/inspecciones/{id}/resultados/{idResultado}:
 *   delete:
 *     summary: Eliminar un resultado
 *     tags: [Inspecciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idResultado
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resultado eliminado
 */
router.delete("/:id/resultados/:idResultado", resultadosController.remove);

/**
 * @swagger
 * /api/v1/inspecciones/{id}/comentarios:
 *   get:
 *     summary: Obtener comentarios de una inspección
 *     tags: [Inspecciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comentarios con nombre de usuario
 */
router.get("/:id/comentarios", comentariosController.getByInspeccion);

/**
 * @swagger
 * /api/v1/inspecciones/{id}/comentarios:
 *   post:
 *     summary: Agregar comentario a una inspección
 *     tags: [Inspecciones]
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
 *             required: [comentario]
 *             properties:
 *               comentario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentario agregado
 */
router.post("/:id/comentarios", comentariosController.create);

/**
 * @swagger
 * /api/v1/inspecciones/{id}/comentarios/{idComentario}:
 *   delete:
 *     summary: Eliminar comentario
 *     tags: [Inspecciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idComentario
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comentario eliminado
 */
router.delete("/:id/comentarios/:idComentario", comentariosController.remove);

/**
 * @swagger
 * /api/v1/inspecciones/{id}/archivos:
 *   get:
 *     summary: Obtener archivos de una inspección
 *     tags: [Inspecciones]
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
router.get("/:id/archivos", archivosController.getByInspeccion);

/**
 * @swagger
 * /api/v1/inspecciones/{id}/archivos:
 *   post:
 *     summary: Subir archivo a una inspección
 *     tags: [Inspecciones]
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
 * /api/v1/inspecciones/{id}/archivos/{idArchivo}:
 *   delete:
 *     summary: Eliminar archivo de una inspección
 *     tags: [Inspecciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idArchivo
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Archivo eliminado
 */
router.delete("/:id/archivos/:idArchivo", archivosController.remove);

export default router;
