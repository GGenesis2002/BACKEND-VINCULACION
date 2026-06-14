import * as utils from "../../../utils.js";
import usuariosService from "./usuarios.service.js";

// ─── Existentes (sin cambios) ────────────────────────────────────────────────

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

// ─── Nuevos (admin) ──────────────────────────────────────────────────────────

/**
 * GET /api/v1/usuarios/admin
 * Lista todos los usuarios con filtros: ?busqueda=&activo=true&rol=inspector
 */
const getAllAdmin = async (req, res) => {
  try {
    const users = await usuariosService.getAllAdmin(req.query);
    return res.status(200).json(users);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

/**
 * PATCH /api/v1/usuarios/:id/estado
 * Body: { activo: true | false }
 */
const cambiarEstado = async (req, res) => {
  try {
    const idSolicitante = req.user.id_usuario;
    const user = await usuariosService.cambiarEstado(req.params.id, req.body, idSolicitante);
    return res.status(200).json(user);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

/**
 * DELETE /api/v1/usuarios/:id
 */
const remove = async (req, res) => {
  try {
    const idSolicitante = req.user.id_usuario;
    await usuariosService.remove(req.params.id, idSolicitante);
    return res.status(200).json({ success: true, message: "Usuario eliminado." });
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export default {
  // existentes
  getAll,
  getByRole,
  getById,
  update,
  updateRol,
  // nuevos
  getAllAdmin,
  cambiarEstado,
  remove,
};