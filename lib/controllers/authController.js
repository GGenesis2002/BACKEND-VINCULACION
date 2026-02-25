import * as utils from "../../utils.js";
import authService from "../service/authService.js";
import userRepository from "../repositories/userRepository.js";
import crypto from "crypto";
import { sendResetEmail } from "../service/emailService.js";

export const register = async (req, res) => {
  try {
    const user = await authService.register({ ...req.body }, { ...req.file });
    return res.status(200).json(user);
  } catch (error) {
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

// En authController.js

const forgotPassword = async (req, res) => { // Cambiado para recibir req y res
  try {
    const { email } = req.body; // Extraemos el string del email

    if (!email) {
      return res.status(400).json({ message: "El email es requerido" });
    }

    const usuario = await userRepository.getUserByEmail(email);

    if (!usuario) {
      // Por seguridad, a veces es mejor decir que se envió si existe, 
      // pero para debugear usaremos este error:
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const token = crypto.randomBytes(3).toString("hex").toUpperCase();
    const expiracion = new Date(Date.now() + 15 * 60 * 1000);

    await userRepository.createResetToken(
      usuario.id_usuario,
      token,
      expiracion
    );

    try {
      await sendResetEmail(email, token);
      return res.status(200).json({ message: "Código de verificación enviado" });
    } catch (error) {
      console.log("Error de correo:", error.message);
      return res.status(500).json({ message: "Error al enviar el correo" });
    }

  } catch (error) {
    console.error("Error en forgotPassword:", error);
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
