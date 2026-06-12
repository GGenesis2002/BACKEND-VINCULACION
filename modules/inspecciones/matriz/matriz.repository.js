import db from "../../../data/database.js";
import DatabaseTable from "../../../data/databaseTables.js";

const findAll = () =>
  db(DatabaseTable.matrizPuntuacion)
    .where({ activo: true })
    .orderBy("categoria", "asc");

const findById = (id) =>
  db(DatabaseTable.matrizPuntuacion).where({ id_criterio: id }).first();

export default { findAll, findById };
