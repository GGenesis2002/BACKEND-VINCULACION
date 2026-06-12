import db from "../../../data/database.js";
import DatabaseTable from "../../../data/databaseTables.js";

const findAll = () =>
  db(DatabaseTable.estadosInspeccion)
    .where({ activo: true })
    .orderBy("orden", "asc");

const findByCodigo = (codigo) =>
  db(DatabaseTable.estadosInspeccion).where({ codigo }).first();

export default { findAll, findByCodigo };
