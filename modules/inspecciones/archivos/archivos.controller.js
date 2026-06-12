import * as utils from "../../../utils.js";
import archivosService from "./archivos.service.js";

const getByInspeccion = async (req, res) => {
  try {
    return res.status(200).json(await archivosService.getByInspeccion(req.params.id));
  } catch (error) { utils.ErrorManager(error, res); }
};

const upload = async (req, res) => {
  try {
    return res.status(201).json(await archivosService.upload(req.params.id, req.file));
  } catch (error) { utils.ErrorManager(error, res); }
};

const remove = async (req, res) => {
  try {
    await archivosService.remove(req.params.idArchivo);
    return res.status(200).json({ success: true, message: "Archivo eliminado." });
  } catch (error) { utils.ErrorManager(error, res); }
};

export default { getByInspeccion, upload, remove };
