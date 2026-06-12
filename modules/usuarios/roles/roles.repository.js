import db from "../../../data/database.js";
import DatabaseTable from "../../../data/databaseTables.js";

const findAll = () =>
  db(DatabaseTable.roles).select("*").where({ activo: true }).orderBy("nombre", "asc");

const findById = (id) =>
  db(DatabaseTable.roles).where({ id }).first();

const findByUsuario = (idUsuario) =>
  db(DatabaseTable.usuariosRoles)
    .join(`${DatabaseTable.roles} as r`, "r.id", `${DatabaseTable.usuariosRoles}.rol_id`)
    .where({ [`${DatabaseTable.usuariosRoles}.id_usuario`]: idUsuario })
    .select("r.id", "r.nombre", "r.codigo", "r.descripcion");

const assignRol = (trx, idUsuario, idRol) =>
  trx(DatabaseTable.usuariosRoles)
    .insert({ id_usuario: idUsuario, rol_id: idRol })
    .onConflict(["id_usuario", "rol_id"])
    .ignore();

const removeRol = (trx, idUsuario, idRol) =>
  trx(DatabaseTable.usuariosRoles)
    .where({ id_usuario: idUsuario, rol_id: idRol })
    .delete();

export default {
  findAll,
  findById,
  findByUsuario,
  assignRol,
  removeRol,
};
