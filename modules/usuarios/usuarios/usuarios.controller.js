import * as utils from "../../../utils.js";
import usuariosService from "./usuarios.service.js";

const getAll = async (req, res) => {
  try {
    const users = await usuariosService.getAll();
    return res.status(200).json(users);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const getByRole = async (req, res) => {
  try {
    const users = await usuariosService.getByRole(req.params.rol);
    return res.status(200).json(users);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const getById = async (req, res) => {
  try {
    const user = await usuariosService.getById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const update = async (req, res) => {
  try {
    const user = await usuariosService.update(req.params.id, req.body, req.file);
    return res.status(200).json(user);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const updateRol = async (req, res) => {
  try {
    const user = await usuariosService.updateRol(req.params.id, req.body);
    return res.status(200).json(user);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export default { getAll, getByRole, getById, update, updateRol };
