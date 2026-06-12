import * as utils from "../../../utils.js";
import inspeccionesService from "./inspecciones.service.js";

const getAll = async (req, res) => {
  try {
    return res.status(200).json(await inspeccionesService.getAll());
  } catch (error) { utils.ErrorManager(error, res); }
};

const getById = async (req, res) => {
  try {
    return res.status(200).json(await inspeccionesService.getById(req.params.id));
  } catch (error) { utils.ErrorManager(error, res); }
};

const getByEdificio = async (req, res) => {
  try {
    return res.status(200).json(await inspeccionesService.getByEdificio(req.params.idEdificio));
  } catch (error) { utils.ErrorManager(error, res); }
};

const create = async (req, res) => {
  try {
    return res.status(201).json(await inspeccionesService.create(req.body));
  } catch (error) { utils.ErrorManager(error, res); }
};

const update = async (req, res) => {
  try {
    return res.status(200).json(await inspeccionesService.update(req.params.id, req.body));
  } catch (error) { utils.ErrorManager(error, res); }
};

const cambiarEstado = async (req, res) => {
  try {
    return res.status(200).json(await inspeccionesService.cambiarEstado(req.params.id, req.body));
  } catch (error) { utils.ErrorManager(error, res); }
};

export default { getAll, getById, getByEdificio, create, update, cambiarEstado };
