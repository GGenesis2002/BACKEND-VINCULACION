import db from "../../../data/database.js";
import DatabaseTable from "../../../data/databaseTables.js";

const findPermisosByRol = (idRol) =>
  db(DatabaseTable.rolPermisos)
    .join(`${DatabaseTable.opcionAcciones} as oa`, "oa.id", `${DatabaseTable.rolPermisos}.opcion_accion_id`)
    .join(`${DatabaseTable.opciones} as op`, "op.id", "oa.opcion_id")
    .join(`${DatabaseTable.acciones} as ac`, "ac.id", "oa.accion_id")
    .where({ [`${DatabaseTable.rolPermisos}.rol_id`]: idRol })
    .select(
      "op.codigo as opcion",
      "op.nombre as nombre_opcion",
      "op.ruta",
      "op.icono",
      "op.orden",
      "ac.codigo as accion",
      "ac.nombre as nombre_accion"
    )
    .orderBy("op.orden", "asc");

const findModulos = () =>
  db(DatabaseTable.modulos).select("*").where({ activo: true }).orderBy("orden", "asc");

const findOpciones = () =>
  db(DatabaseTable.opciones).select("*").where({ activo: true }).orderBy("orden", "asc");

const findAcciones = () =>
  db(DatabaseTable.acciones).select("*").orderBy("nombre", "asc");

export default {
  findPermisosByRol,
  findModulos,
  findOpciones,
  findAcciones,
};
