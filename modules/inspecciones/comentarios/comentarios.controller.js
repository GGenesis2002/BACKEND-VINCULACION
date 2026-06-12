import * as utils from "../../../utils.js";
import comentariosService from "./comentarios.service.js";

const getByInspeccion = async (req, res) => {
  try {
    return res.status(200).json(await comentariosService.getByInspeccion(req.params.id));
  } catch (error) { utils.ErrorManager(error, res); }
};

const create = async (req, res) => {
  try {
    const nuevo = await comentariosService.create(req.params.id, req.user.id, req.body);
    return res.status(201).json(nuevo);
  } catch (error) { utils.ErrorManager(error, res); }
};

const remove = async (req, res) => {
  try {
    await comentariosService.remove(req.params.idComentario);
    return res.status(200).json({ success: true, message: "Comentario eliminado." });
  } catch (error) { utils.ErrorManager(error, res); }
};

export default { getByInspeccion, create, remove };
