import db from "../../../data/database.js";
import DatabaseTable from "../../../data/databaseTables.js";

const findByInspeccion = (idInspeccion) =>
  db(`${DatabaseTable.resultadosInspeccion} as r`)
    .select(
      "r.*",
      "m.descripcion_criterio",
      "m.categoria",
      "m.peso_maximo"
    )
    .join(`${DatabaseTable.matrizPuntuacion} as m`, "m.id_criterio", "r.id_criterio")
    .where({ "r.id_inspeccion": idInspeccion });

const insertBulk = (trx, rows) =>
  trx(DatabaseTable.resultadosInspeccion).insert(rows).returning("*");

const update = (trx, idResultado, data) =>
  trx(DatabaseTable.resultadosInspeccion)
    .where({ id_resultado: idResultado })
    .update(data)
    .returning("*");

const remove = (trx, idResultado) =>
  trx(DatabaseTable.resultadosInspeccion).where({ id_resultado: idResultado }).delete();

export default { findByInspeccion, insertBulk, update, remove };
