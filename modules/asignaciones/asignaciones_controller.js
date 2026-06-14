import * as utils from "../../../utils.js";
import asignacionesService from "./asignaciones_service.js";

/** GET /asignaciones  (solo admin) */
const getAll = async (req, res) => {
  try {
    return res.status(200).json(await asignacionesService.getAll());
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

/** GET /asignaciones/inspector  → asignaciones creadas por el inspector autenticado */
const getMisAsignacionesInspector = async (req, res) => {
  try {
    const idInspector = req.user.id_usuario;
    return res.status(200).json(await asignacionesService.getByInspector(idInspector));
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

/** GET /asignaciones/mis-asignaciones  → edificios asignados al ayudante autenticado */
const getMisAsignaciones = async (req, res) => {
  try {
    const idAyudante = req.user.id_usuario;
    return res.status(200).json(await asignacionesService.getMisAsignaciones(idAyudante));
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

/** GET /asignaciones/edificio/:idEdificio */
const getByEdificio = async (req, res) => {
  try {
    return res.status(200).json(
      await asignacionesService.getByEdificio(req.params.idEdificio)
    );
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

/** GET /asignaciones/:id */
const getById = async (req, res) => {
  try {
    return res.status(200).json(await asignacionesService.getById(req.params.id));
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

/** POST /asignaciones  → inspector asigna edificio a ayudante por cédula */
const create = async (req, res) => {
  try {
    const idInspector = req.user.id_usuario;
    const asignacion = await asignacionesService.create(req.body, idInspector);
    return res.status(201).json(asignacion);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

/** PATCH /asignaciones/:id/estado  → revocar o reactivar */
const cambiarEstado = async (req, res) => {
  try {
    const { id_usuario, rol } = req.user;
    return res.status(200).json(
      await asignacionesService.cambiarEstado(req.params.id, req.body, id_usuario, rol)
    );
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

/** DELETE /asignaciones/:id */
const remove = async (req, res) => {
  try {
    const { id_usuario, rol } = req.user;
    await asignacionesService.remove(req.params.id, id_usuario, rol);
    return res.status(200).json({ success: true, message: "Asignación eliminada." });
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export default {
  getAll,
  getMisAsignacionesInspector,
  getMisAsignaciones,
  getByEdificio,
  getById,
  create,
  cambiarEstado,
  remove,
};
