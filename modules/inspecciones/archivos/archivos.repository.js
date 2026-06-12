import db from "../../../data/database.js";
import DatabaseTable from "../../../data/databaseTables.js";

const findByInspeccion = (idInspeccion) =>
  db(DatabaseTable.archivosInspeccion)
    .where({ id_inspeccion: idInspeccion })
    .orderBy("created_at", "desc");

const insert = (trx, data) =>
  trx(DatabaseTable.archivosInspeccion).insert(data).returning("*");

const remove = (trx, idArchivo) =>
  trx(DatabaseTable.archivosInspeccion).where({ id_archivo_ins: idArchivo }).delete();

const findById = (id) =>
  db(DatabaseTable.archivosInspeccion).where({ id_archivo_ins: id }).first();

export default { findByInspeccion, insert, remove, findById };
