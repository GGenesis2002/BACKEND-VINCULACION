import db from "../../../data/database.js";
import * as utils from "../../../utils.js";
import AnomalyCode from "../../../anomaly.js";
import bucket from "../../shared/supabase/supabase.js";
import {
  UpdateUsuarioSchema,
  UpdateRolSchema,
  CambiarEstadoUsuarioSchema,
  FiltrosAdminSchema,
} from "./usuarios_schema.js";
import usuariosRepository from "./usuarios_repository.js";

// ─── Existentes (sin cambios) ────────────────────────────────────────────────

const getAll = () => usuariosRepository.findAll();

const getByRole = (rol) => usuariosRepository.findByRole(rol);

const getById = async (id) => {
  const user = await usuariosRepository.findById(id);
  if (!user) throw new utils.CustomError(AnomalyCode.userDoesNotExist, "Usuario no encontrado");
  return user;
};

const update = async (id, body, file) => {
  const current = await getById(id);
  const parsed = UpdateUsuarioSchema.parse(body);

  const data = {
    nombre:    parsed.nombre?.trim()    || current.nombre,
    email:     parsed.email?.trim()     || current.email,
    cedula:    parsed.cedula?.trim()    || current.cedula,
    telefono:  parsed.telefono?.trim()  || current.telefono,
    direccion: parsed.direccion?.trim() || current.direccion,
  };

  if (parsed.password) {
    const { password_hash } = await usuariosRepository.findPasswordHash(id);
    const valid = await utils.verifyPassword(parsed.currentPassword, password_hash);
    if (!valid) throw new utils.CustomError(AnomalyCode.wrongPassword, "La contraseña actual es incorrecta");
    data.password_hash = await utils.hashPassword(parsed.password);
  }

  if (file && file.buffer) {
    const fileName = `users/${Date.now()}-${file.originalname}`;
    const { data: uploaded, error } = await bucket
      .from(process.env.STORAGE_BUCKET)
      .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: true });
    if (error) throw error;
    const { data: { publicUrl } } = bucket.from(process.env.STORAGE_BUCKET).getPublicUrl(fileName);
    data.foto_perfil_url = publicUrl;
  }

  const trx = await db.transaction();
  try {
    const [user] = await usuariosRepository.update(trx, id, data);
    await trx.commit();
    return user;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const updateRol = async (id, body) => {
  const { rol } = UpdateRolSchema.parse(body);
  await getById(id);

  const trx = await db.transaction();
  try {
    const [user] = await usuariosRepository.updateRol(trx, id, rol);
    await trx.commit();
    return user;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

// ─── Nuevos (admin) ──────────────────────────────────────────────────────────

/**
 * Listado con filtros para el panel de admin.
 * Acepta query params: busqueda, activo (true/false), rol
 */
const getAllAdmin = (queryParams) => {
  const filtros = FiltrosAdminSchema.parse(queryParams);
  return usuariosRepository.findAllAdmin(filtros);
};

/**
 * Activar o desactivar un usuario.
 * No se puede desactivar a uno mismo.
 */
const cambiarEstado = async (id, body, idSolicitante) => {
  if (id === idSolicitante) {
    throw new utils.CustomError(
      AnomalyCode.forbidden,
      "No puedes cambiar tu propio estado"
    );
  }

  const { activo } = CambiarEstadoUsuarioSchema.parse(body);
  await getById(id); // verifica que exista

  const trx = await db.transaction();
  try {
    const [user] = await usuariosRepository.cambiarEstado(trx, id, activo);
    await trx.commit();
    return user;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

/**
 * Eliminar usuario permanentemente.
 * No se puede eliminar a uno mismo.
 */
const remove = async (id, idSolicitante) => {
  if (id === idSolicitante) {
    throw new utils.CustomError(
      AnomalyCode.forbidden,
      "No puedes eliminar tu propia cuenta desde el panel de administración"
    );
  }

  await getById(id); // verifica que exista

  const trx = await db.transaction();
  try {
    await usuariosRepository.remove(trx, id);
    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
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