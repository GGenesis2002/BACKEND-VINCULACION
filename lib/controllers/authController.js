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

const forgotPassword = async (req, res) => { // Debe recibir req y res
  try {
    // 1. Extraemos el email del cuerpo de la petición
    const { email } = req.body; 

    if (!email) {
      return res.status(400).json({ message: "El email es requerido" });
    }

    // 2. Buscamos al usuario
    const usuario = await userRepository.getUserByEmail(email);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 3. Generamos el token de 6 caracteres
    const token = crypto.randomBytes(3).toString("hex").toUpperCase();
    const expiracion = new Date(Date.now() + 15 * 60 * 1000);

    // 4. Guardamos el token en la base de datos
    await userRepository.createResetToken(
      usuario.id_usuario,
      token,
      expiracion
    );

    // 5. Enviamos el correo (con manejo de error para que no bloquee la respuesta)
    try {
      await sendResetEmail(email, token);
      return res.status(200).json({ 
        success: true, 
        message: "Código de recuperación enviado al correo" 
      });
    } catch (mailError) {
      console.error("Error al enviar email:", mailError.message);
      // Respondemos éxito porque el token sí se creó, pero avisamos del problema del mail
      return res.status(200).json({ 
        success: true, 
        message: "Token generado, pero hubo un problema enviando el correo. Revisa los logs." 
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
