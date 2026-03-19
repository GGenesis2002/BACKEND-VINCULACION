import * as utils from "../../utils.js";
import {
  LoginSchema,
  RegisterSchema,
  UserProfilePictureSchema,
} from "../schema/authSchema.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import authRepos from "../repositories/authRepository.js";
import userRepository from "../repositories/userRepository.js";
import { sendResetEmail } from "../service/emailService.js";



const register = async (userData, userProfilePicture) => {
  //VALIDAR FOTO DE PERFIL (DEBE LLEGAR UN FILE)
  let parsedImage;
  utils.isEmptyObject(userProfilePicture) || userProfilePicture === null
    ? (parsedImage = null)
    : (parsedImage = UserProfilePictureSchema.parse({
        foto_perfil: userProfilePicture,
      }));

  //VALIDAR JSON DE REGISTRO
  let parsedData = RegisterSchema.parse(userData);
  parsedData.password_hash = await utils.hashPassword(parsedData.password);
  delete parsedData.password;
  return await authRepos.register(parsedData, parsedImage);
};

const login = async (loginData) => {
  const parsedData = LoginSchema.parse(loginData);
  return await authRepos.login(parsedData);
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

  // ⭐ ENVÍA EMAIL REAL
  await sendResetEmail(email, token);

};




const resetPassword = async (token, newPassword) => {

  const registro = await userRepository.getValidToken(token);

  if (!registro) {
    throw new Error("Token inválido o expirado");
  }

  const hash = await bcrypt.hash(newPassword, 10);

  await userRepository.updatePassword(
    registro.id_usuario,
    hash
  );

  await userRepository.markTokenUsed(token);
};

const authService = { login,
  register,
  forgotPassword,
  resetPassword };

export default authService;
