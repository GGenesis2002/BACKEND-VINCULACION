import * as utils from "../../utils.js";
import authService from "../service/authService.js";
import userRepository from "../repositories/userRepository.js";
import crypto from "crypto";
import { sendResetEmail } from "../service/emailService.js";
import jwt from "jsonwebtoken"; // Asegúrate de tener esta importación

export const register = async (req, res) => {
  try {
    // 1. Ejecutamos el registro
    const userResult = await authService.register({ ...req.body }, { ...req.file });

    // 2. IMPORTANTE: Extraemos el primer usuario si el servicio devuelve un Array
    // Esto corrige el error de "List<dynamic> is not a subtype of Map"
    const user = Array.isArray(userResult) ? userResult[0] : userResult;

    // 3. Generamos un token para que el inicio de sesión sea automático y Flutter no falle
    // Reemplaza 'TU_JWT_SECRET' por tu variable de entorno
    const token = jwt.sign({ id: user.id_usuario }, process.env.JWT_SECRET || 'secret');

    // 4. Devolvemos una estructura idéntica al Login
    return res.status(201).json({ 
      success: true, 
      token, 
      userId: user.id_usuario,
      user: user // Enviamos el objeto completo por si la App lo necesita
    });

  } catch (error) {
    console.error("Error en Registro:", error);
    utils.ErrorManager(error, res);
  }
};

export const login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);
    return res
      .status(200)
      .json({ success: true, token, userId: user.id_usuario });
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body; 

    const usuario = await userRepository.getUserByEmail(email);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const token = crypto.randomBytes(3).toString("hex").toUpperCase();
    const expiracion = new Date(Date.now() + 15 * 60 * 1000);

    await userRepository.createResetToken(usuario.id_usuario, token, expiracion);

    // Intentamos enviar el correo
    try {
      await sendResetEmail(email, token);
      return res.status(200).json({ 
        success: true, 
        message: "Código enviado a su correo." 
      });
    } catch (mailError) {
      // Si el servicio de correo falla, avisamos pero no rompemos la app
      return res.status(500).json({ 
        message: "El código se generó pero el servicio de correo falló. Intente más tarde." 
      });
    }

  } catch (error) {
    console.error("Error en forgotPassword:", error.message);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    await authService.resetPassword(token, newPassword);

    res.json({ message: "Contraseña actualizada" });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


const authController = {
  login,
  register,
  forgotPassword,
  resetPassword
};
export default authController;
