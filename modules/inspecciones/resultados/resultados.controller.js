import * as utils from "../../../utils.js";
import resultadosService from "./resultados.service.js";

const getByInspeccion = async (req, res) => {
  try {
    return res.status(200).json(await resultadosService.getByInspeccion(req.params.id));
  } catch (error) { utils.ErrorManager(error, res); }
};

const saveBulk = async (req, res) => {
  try {
    return res.status(201).json(await resultadosService.saveBulk(req.params.id, req.body));
  } catch (error) { utils.ErrorManager(error, res); }
};

const update = async (req, res) => {
  try {
    return res.status(200).json(await resultadosService.update(req.params.idResultado, req.body));
  } catch (error) { utils.ErrorManager(error, res); }
};

const remove = async (req, res) => {
  try {
    await resultadosService.remove(req.params.idResultado);
    return res.status(200).json({ success: true, message: "Resultado eliminado." });
  } catch (error) { utils.ErrorManager(error, res); }
};

export default { getByInspeccion, saveBulk, update, remove };
