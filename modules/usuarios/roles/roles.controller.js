import * as utils from "../../../utils.js";
import rolesService from "./roles.service.js";

const getAll = async (req, res) => {
  try {
    const roles = await rolesService.getAll();
    return res.status(200).json(roles);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const getByUsuario = async (req, res) => {
  try {
    const roles = await rolesService.getByUsuario(req.params.idUsuario);
    return res.status(200).json(roles);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const assignRol = async (req, res) => {
  try {
    await rolesService.assignRol(req.params.idUsuario, req.body.idRol);
    return res.status(200).json({ success: true, message: "Rol asignado." });
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const removeRol = async (req, res) => {
  try {
    await rolesService.removeRol(req.params.idUsuario, req.body.idRol);
    return res.status(200).json({ success: true, message: "Rol removido." });
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export default { getAll, getByUsuario, assignRol, removeRol };
