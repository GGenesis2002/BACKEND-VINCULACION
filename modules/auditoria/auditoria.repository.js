import db from "../../data/database.js";
import DatabaseTable from "../../data/databaseTables.js";

const findAll = ({ tabla, idUsuario, desde, hasta, limit = 100, offset = 0 } = {}) => {
  let query = db(`${DatabaseTable.historialAuditoria} as h`)
    .select(
      "h.*",
      "u.nombre as nombre_usuario",
      "u.email as email_usuario"
    )
    .leftJoin(`${DatabaseTable.usuarios} as u`, "u.id_usuario", "h.id_usuario")
    .orderBy("h.fecha", "desc")
    .limit(limit)
    .offset(offset);

  if (tabla) query = query.where("h.tabla_afectada", tabla);
  if (idUsuario) query = query.where("h.id_usuario", idUsuario);
  if (desde) query = query.where("h.fecha", ">=", desde);
  if (hasta) query = query.where("h.fecha", "<=", hasta);

  return query;
};

const findById = (id) =>
  db(`${DatabaseTable.historialAuditoria} as h`)
    .select("h.*", "u.nombre as nombre_usuario", "u.email as email_usuario")
    .leftJoin(`${DatabaseTable.usuarios} as u`, "u.id_usuario", "h.id_usuario")
    .where("h.id_log", id)
    .first();

const findTablas = () =>
  db(DatabaseTable.historialAuditoria)
    .distinct("tabla_afectada")
    .whereNotNull("tabla_afectada")
    .orderBy("tabla_afectada", "asc");

export default { findAll, findById, findTablas };
