import db from "../../../data/database.js";
import DatabaseTable from "../../../data/databaseTables.js";

// Columnas base de usuario (sin password_hash, sin rol crudo)
const BASE_COLS = [
  "u.id_usuario",
  "u.nombre",
  "u.email",
  "u.cedula",
  "u.telefono",
  "u.direccion",
  "u.foto_perfil_url",
  "u.activo",
  "u.created_at",
  "r.id as rol_id",
  "r.codigo as rol_codigo",
  "r.nombre as rol_nombre",
];

const baseQuery = () =>
  db(`${DatabaseTable.usuarios} as u`)
    .leftJoin(`${DatabaseTable.roles} as r`, "r.id", "u.rol_id");

const findAll = () =>
  baseQuery().select(BASE_COLS).where({ "u.activo": true }).orderBy("u.nombre", "asc");

const findByRole = (rolCodigo) =>
  baseQuery()
    .select(BASE_COLS)
    .where({ "r.codigo": rolCodigo, "u.activo": true });

const findById = (id) =>
  baseQuery()
    .select(BASE_COLS)
    .where({ "u.id_usuario": id, "u.activo": true })
    .first();

const findPasswordHash = (id) =>
  db(DatabaseTable.usuarios).select("password_hash").where({ id_usuario: id }).first();

const update = (trx, id, data) =>
  trx(DatabaseTable.usuarios)
    .where({ id_usuario: id })
    .update(data)
    .returning(["id_usuario", "nombre", "email", "cedula", "foto_perfil_url"]);

const updateRol = async (trx, id, rolCodigo) => {
  // Buscar el rol_id por codigo
  const rol = await trx(DatabaseTable.roles).where({ codigo: rolCodigo }).first();
  if (!rol) throw new Error(`Rol '${rolCodigo}' no encontrado`);
  return trx(DatabaseTable.usuarios)
    .where({ id_usuario: id })
    .update({ rol_id: rol.id })
    .returning(["id_usuario", "nombre", "email", "rol_id"]);
};

export default {
  findAll,
  findByRole,
  findById,
  findPasswordHash,
  update,
  updateRol,
};
