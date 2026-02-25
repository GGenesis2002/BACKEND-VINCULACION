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

const forgotPassword = async (email) => {
  const usuario = await userRepository.getUserByEmail(email);

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  const token = crypto.randomBytes(3).toString("hex").toUpperCase();
  const expiracion = new Date(Date.now() + 15 * 60 * 1000);

  await userRepository.createResetToken(
    usuario.id_usuario,
    token,
    expiracion
  );

  // Intentar enviar el email pero capturar el error para que no rompa la app
  try {
    await sendResetEmail(email, token);
  } catch (error) {
    // Si el email falla, igual queremos que el proceso continúe o avisar al usuario
    console.log("El token se generó pero el correo falló:", error.message);
    throw new Error("Error al enviar el correo. Verifica tu conexión o intenta más tarde.");
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
