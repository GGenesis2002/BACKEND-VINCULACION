import * as utils from "../../utils.js";
import auditoriaService from "./auditoria.service.js";

const getAll = async (req, res) => {
  try {
    const { tabla, idUsuario, desde, hasta, limit, offset } = req.query;
    const logs = await auditoriaService.getAll({
      tabla,
      idUsuario,
      desde,
      hasta,
      limit: limit ? parseInt(limit) : 100,
      offset: offset ? parseInt(offset) : 0,
    });
    return res.status(200).json(logs);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const getById = async (req, res) => {
  try {
    return res.status(200).json(await auditoriaService.getById(req.params.id));
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const getTablas = async (req, res) => {
  try {
    return res.status(200).json(await auditoriaService.getTablas());
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export default { getAll, getById, getTablas };
