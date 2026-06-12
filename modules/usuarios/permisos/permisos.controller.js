import * as utils from "../../../utils.js";
import permisosService from "./permisos.service.js";

const getPermisosByRol = async (req, res) => {
  try {
    const permisos = await permisosService.getPermisosByRol(req.params.idRol);
    return res.status(200).json(permisos);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const getModulos = async (req, res) => {
  try {
    const modulos = await permisosService.getModulos();
    return res.status(200).json(modulos);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const getOpciones = async (req, res) => {
  try {
    const opciones = await permisosService.getOpciones();
    return res.status(200).json(opciones);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const getAcciones = async (req, res) => {
  try {
    const acciones = await permisosService.getAcciones();
    return res.status(200).json(acciones);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export default { getPermisosByRol, getModulos, getOpciones, getAcciones };
