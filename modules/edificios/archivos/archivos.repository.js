import db from "../../../data/database.js";
import DatabaseTable from "../../../data/databaseTables.js";

const findByEdificio = (idEdificio) =>
  db(DatabaseTable.archivosEdificio)
    .where({ id_edificio: idEdificio })
    .orderBy("created_at", "desc");

const insert = (trx, data) =>
  trx(DatabaseTable.archivosEdificio).insert(data).returning("*");

const remove = (trx, idArchivo) =>
  trx(DatabaseTable.archivosEdificio).where({ id: idArchivo }).delete();

const findById = (id) =>
  db(DatabaseTable.archivosEdificio).where({ id }).first();

export default { findByEdificio, insert, remove, findById };
