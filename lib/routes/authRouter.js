import express from "express";
import authController from "../controllers/authController.js";
import multer from "multer";

const authRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar usuario
 *     tags: [Autenticación]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@ejemplo.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: miPassword123
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Credenciales inválidas
 */
authRouter.post("/login", authController.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Autenticación]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *               - rol
 *               - cedula
 *               - telefono
 *             properties:
 *               cedula:
 *                 type: string
 *                 example: 1234567890
 *               nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@ejemplo.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: miPassword123
 *               rol:
 *                 type: string
 *                 enum: [inspector, ayudante]
 *                 example: inspector
 *               telefono:
 *                 type: string
 *                 example: 0987654324
 *               foto_perfil:
 *                 type: string
 *                 format: binary
 *                 description: Foto de perfil del usuario
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 */
authRouter.post(
  "/register",
  upload.single("foto_perfil"),
  authController.register
);

authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password", authController.resetPassword);


export default authRouter;

