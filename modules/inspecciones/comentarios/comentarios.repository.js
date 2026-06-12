import db from "../../../data/database.js";
import DatabaseTable from "../../../data/databaseTables.js";

const findByInspeccion = (idInspeccion) =>
  db(`${DatabaseTable.comentariosInspeccion} as c`)
    .select("c.*", "u.nombre as nombre_usuario")
    .leftJoin(`${DatabaseTable.usuarios} as u`, "u.id_usuario", "c.id_usuario")
    .where({ "c.id_inspeccion": idInspeccion })
    .orderBy("c.created_at", "asc");

const insert = (trx, data) =>
  trx(DatabaseTable.comentariosInspeccion).insert(data).returning("*");

const remove = (trx, idComentario) =>
  trx(DatabaseTable.comentariosInspeccion).where({ id_comentario: idComentario }).delete();

const findById = (id) =>
  db(DatabaseTable.comentariosInspeccion).where({ id_comentario: id }).first();

export default { findByInspeccion, insert, remove, findById };
