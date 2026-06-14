import db from "../../../data/database.js";
import DatabaseTable from "../../../data/databaseTables.js";

// ─── Joins reutilizables ────────────────────────────────────────────────────
const baseQuery = () =>
  db(`${DatabaseTable.asignaciones} as a`)
    .select(
      "a.id",
      "a.estado",
      "a.created_at",
      "a.updated_at",
      // Edificio
      "e.id_edificio",
      "e.nombre_edificio",
      "e.direccion",
      "e.ciudad",
      // Inspector
      "ins.id_usuario  as id_inspector",
      "ins.nombre      as nombre_inspector",
      "ins.email       as email_inspector",
      // Ayudante
      "ayu.id_usuario  as id_ayudante",
      "ayu.nombre      as nombre_ayudante",
      "ayu.email       as email_ayudante",
      "ayu.cedula      as cedula_ayudante"
    )
    .join(`${DatabaseTable.edificios}  as e`,   "e.id_edificio",  "a.id_edificio")
    .join(`${DatabaseTable.usuarios}   as ins`,  "ins.id_usuario", "a.id_inspector")
    .join(`${DatabaseTable.usuarios}   as ayu`,  "ayu.id_usuario", "a.id_ayudante");

// ─── Queries ────────────────────────────────────────────────────────────────

/** Todas las asignaciones (admin / inspector ve todo) */
const findAll = () =>
  baseQuery().orderBy("a.created_at", "desc");

/** Asignaciones donde el inspector es el usuario autenticado */
const findByInspector = (idInspector) =>
  baseQuery()
    .where("a.id_inspector", idInspector)
    .orderBy("a.created_at", "desc");

/** Asignaciones activas donde el ayudante es el usuario autenticado */
const findByAyudante = (idAyudante) =>
  baseQuery()
    .where("a.id_ayudante", idAyudante)
    .where("a.estado", "activa")
    .orderBy("a.created_at", "desc");

/** Asignaciones de un edificio concreto */
const findByEdificio = (idEdificio) =>
  baseQuery()
    .where("a.id_edificio", idEdificio)
    .orderBy("a.created_at", "desc");

/** Una asignación por PK */
const findById = (id) =>
  baseQuery().where("a.id", id).first();

/** Verifica si ya existe la combinación edificio+ayudante (para evitar duplicados) */
const findExisting = (idEdificio, idAyudante) =>
  db(DatabaseTable.asignaciones)
    .where({ id_edificio: idEdificio, id_ayudante: idAyudante })
    .first();

/** Inserta una asignación y devuelve la fila */
const insert = (trx, data) =>
  trx(DatabaseTable.asignaciones).insert(data).returning("*");

/** Actualiza estado (activa / revocada) */
const updateEstado = (trx, id, estado) =>
  trx(DatabaseTable.asignaciones)
    .where({ id })
    .update({ estado })
    .returning("*");

/** Elimina permanentemente */
const remove = (trx, id) =>
  trx(DatabaseTable.asignaciones).where({ id }).delete();

export default {
  findAll,
  findByInspector,
  findByAyudante,
  findByEdificio,
  findById,
  findExisting,
  insert,
  updateEstado,
  remove,
};
