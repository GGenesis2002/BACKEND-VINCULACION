import * as utils from "../../../utils.js";
import authService from "./auth.service.js";

const login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);
    return res.status(200).json({ success: true, token, userId: user.id_usuario });
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body, req.file);
    return res.status(201).json({ success: true, user });
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const forgotPassword = async (req, res) => {
  try {
    await authService.forgotPassword(req.body.email);
    return res.status(200).json({ success: true, message: "Código enviado a su correo." });
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    return res.status(200).json({ success: true, message: "Contraseña actualizada." });
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export default { login, register, forgotPassword, resetPassword };
