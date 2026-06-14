import db from "../../../data/database.js";
import * as utils from "../../../utils.js";
import AnomalyCode from "../../../anomaly.js";
import DatabaseTable from "../../../data/databaseTables.js";
import { AsignacionSchema, CambiarEstadoAsignacionSchema } from "./asignaciones_schema.js";
import asignacionesRepository from "./asignaciones_repository.js";

// ─── Helpers privados ────────────────────────────────────────────────────────

/** Busca un ayudante por cédula y valida que tenga rol ayudante */
const _buscarAyudantePorCedula = async (cedula) => {
  const usuario = await db(`${DatabaseTable.usuarios} as u`)
    .select("u.id_usuario", "u.nombre", "u.email", "u.cedula", "r.codigo as rol")
    .join(`${DatabaseTable.roles} as r`, "r.id", "u.rol_id")
    .where("u.cedula", cedula)
    .where("u.activo", true)
    .first();

  if (!usuario) {
    throw new utils.CustomError(AnomalyCode.notFound, `No se encontró un usuario activo con cédula '${cedula}'`);
  }
  if (usuario.rol !== "ayudante") {
    throw new utils.CustomError(
      AnomalyCode.forbidden,
      `El usuario con cédula '${cedula}' no tiene rol de ayudante (rol actual: ${usuario.rol})`
    );
  }
  return usuario;
};

/** Verifica que el edificio exista */
const _verificarEdificio = async (idEdificio) => {
  const edificio = await db(DatabaseTable.edificios)
    .where({ id_edificio: idEdificio })
    .first();
  if (!edificio) {
    throw new utils.CustomError(AnomalyCode.notFound, "Edificio no encontrado");
  }
  return edificio;
};

/** Verifica que una asignación exista y la devuelve */
const _getById = async (id) => {
  const asignacion = await asignacionesRepository.findById(id);
  if (!asignacion) {
    throw new utils.CustomError(AnomalyCode.notFound, "Asignación no encontrada");
  }
  return asignacion;
};

// ─── Casos de uso ────────────────────────────────────────────────────────────

/** Admin: ver todas las asignaciones */
const getAll = () => asignacionesRepository.findAll();

/** Inspector: ver solo sus asignaciones */
const getByInspector = (idInspector) =>
  asignacionesRepository.findByInspector(idInspector);

/** Ayudante: ver los edificios que le fueron asignados */
const getMisAsignaciones = (idAyudante) =>
  asignacionesRepository.findByAyudante(idAyudante);

/** Ver asignaciones de un edificio específico */
const getByEdificio = (idEdificio) =>
  asignacionesRepository.findByEdificio(idEdificio);

/** Ver una asignación por ID */
const getById = (id) => _getById(id);

/**
 * Crear asignación.
 * @param {object} body        - { id_edificio, cedula_ayudante }
 * @param {string} idInspector - UUID del inspector autenticado
 */
const create = async (body, idInspector) => {
  const { id_edificio, cedula_ayudante } = AsignacionSchema.parse(body);

  // Validaciones de negocio
  await _verificarEdificio(id_edificio);
  const ayudante = await _buscarAyudantePorCedula(cedula_ayudante);

  // ¿Ya existe la asignación (activa o revocada)?
  const existente = await asignacionesRepository.findExisting(id_edificio, ayudante.id_usuario);
  if (existente) {
    if (existente.estado === "activa") {
      throw new utils.CustomError(
        AnomalyCode.conflict,
        "Este ayudante ya tiene una asignación activa para ese edificio"
      );
    }
    // Si estaba revocada, la reactivamos en lugar de crear un duplicado
    const trx = await db.transaction();
    try {
      const [reactivada] = await asignacionesRepository.updateEstado(trx, existente.id, "activa");
      await trx.commit();
      return reactivada;
    } catch (error) {
      await trx.rollback();
      throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
    }
  }

  // Insertar nueva asignación
  const trx = await db.transaction();
  try {
    const [asignacion] = await asignacionesRepository.insert(trx, {
      id_edificio,
      id_inspector: idInspector,
      id_ayudante: ayudante.id_usuario,
    });
    await trx.commit();
    return asignacion;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

/**
 * Revocar o reactivar una asignación (inspector que la creó o admin).
 * @param {number} id          - PK de la asignación
 * @param {object} body        - { estado: 'activa' | 'revocada' }
 * @param {string} idSolicitante - UUID del usuario autenticado
 * @param {string} rol         - rol del usuario autenticado
 */
const cambiarEstado = async (id, body, idSolicitante, rol) => {
  const { estado } = CambiarEstadoAsignacionSchema.parse(body);
  const asignacion = await _getById(id);

  // Solo el inspector que la creó o un admin puede modificarla
  if (rol !== "administrador" && asignacion.id_inspector !== idSolicitante) {
    throw new utils.CustomError(
      AnomalyCode.forbidden,
      "No tienes permiso para modificar esta asignación"
    );
  }

  const trx = await db.transaction();
  try {
    const [actualizada] = await asignacionesRepository.updateEstado(trx, id, estado);
    await trx.commit();
    return actualizada;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

/**
 * Eliminar asignación permanentemente.
 * Solo el inspector que la creó o un admin puede hacerlo.
 */
const remove = async (id, idSolicitante, rol) => {
  const asignacion = await _getById(id);

  if (rol !== "administrador" && asignacion.id_inspector !== idSolicitante) {
    throw new utils.CustomError(
      AnomalyCode.forbidden,
      "No tienes permiso para eliminar esta asignación"
    );
  }

  const trx = await db.transaction();
  try {
    await asignacionesRepository.remove(trx, id);
    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

export default {
  getAll,
  getByInspector,
  getMisAsignaciones,
  getByEdificio,
  getById,
  create,
  cambiarEstado,
  remove,
};
