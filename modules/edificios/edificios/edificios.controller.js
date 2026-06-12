import * as utils from "../../../utils.js";
import edificiosService from "./edificios.service.js";

const getAll = async (req, res) => {
  try {
    const edificios = await edificiosService.getAll();
    return res.status(200).json(edificios);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const getById = async (req, res) => {
  try {
    const edificio = await edificiosService.getById(req.params.id);
    return res.status(200).json(edificio);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const create = async (req, res) => {
  try {
    const edificio = await edificiosService.create(req.body, {
      foto_edificio: req.files?.["foto_edificio"]?.[0],
      grafico_edificio: req.files?.["grafico_edificio"]?.[0],
    });
    return res.status(201).json(edificio);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const update = async (req, res) => {
  try {
    const edificio = await edificiosService.update(req.params.id, req.body, {
      foto_edificio: req.files?.["foto_edificio"]?.[0],
      grafico_edificio: req.files?.["grafico_edificio"]?.[0],
    });
    return res.status(200).json(edificio);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await edificiosService.remove(req.params.id);
    return res.status(200).json({ deleted, message: deleted ? "Edificio eliminado" : "Edificio no encontrado" });
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export default { getAll, getById, create, update, remove };
