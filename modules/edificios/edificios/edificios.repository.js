import db from "../../../data/database.js";
import DatabaseTable from "../../../data/databaseTables.js";

const findAll = () =>
  db(`${DatabaseTable.edificios} as e`)
    .select(
      "e.*",
      "u.nombre as nombre_inspector",
      "i.fecha_inspeccion",
      "i.estado as estado_inspeccion",
      db.raw("COALESCE(i.puntuacion_final, 0) as puntuacion_final")
    )
    .leftJoin(`${DatabaseTable.inspecciones} as i`, "e.id_edificio", "i.id_edificio")
    .leftJoin(`${DatabaseTable.usuarios} as u`, "i.id_usuario", "u.id_usuario")
    .orderBy("e.created_at", "desc");

const findById = (id) =>
  db(DatabaseTable.edificios).where({ id_edificio: id }).first();

const insert = (trx, data) =>
  trx(DatabaseTable.edificios).insert(data).returning("*");

const update = (trx, id, data) =>
  trx(DatabaseTable.edificios).where({ id_edificio: id }).update(data).returning("*");

const remove = (trx, id) =>
  trx(DatabaseTable.edificios).where({ id_edificio: id }).delete();

export default { findAll, findById, insert, update, remove };
