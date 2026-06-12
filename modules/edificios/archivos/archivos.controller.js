import * as utils from "../../../utils.js";
import archivosService from "./archivos.service.js";

const getByEdificio = async (req, res) => {
  try {
    const archivos = await archivosService.getByEdificio(req.params.id);
    return res.status(200).json(archivos);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const upload = async (req, res) => {
  try {
    const archivo = await archivosService.upload(req.params.id, req.file);
    return res.status(201).json(archivo);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const remove = async (req, res) => {
  try {
    await archivosService.remove(req.params.archivoId);
    return res.status(200).json({ success: true, message: "Archivo eliminado." });
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export default { getByEdificio, upload, remove };
