import db from "../../../data/database.js";
import DatabaseTable from "../../../data/databaseTables.js";

// ─── Columnas base (sin password_hash) ──────────────────────────────────────
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
  "r.id   as rol_id",
  "r.codigo as rol_codigo",
  "r.nombre as rol_nombre",
];

const baseQuery = () =>
  db(`${DatabaseTable.usuarios} as u`)
    .leftJoin(`${DatabaseTable.roles} as r`, "r.id", "u.rol_id");

// ─── Queries existentes (sin cambios) ───────────────────────────────────────

const findAll = () =>
  baseQuery().select(BASE_COLS).where({ "u.activo": true }).orderBy("u.nombre", "asc");

const findByRole = (rolCodigo) =>
  baseQuery()
    .select(BASE_COLS)
    .where({ "r.codigo": rolCodigo, "u.activo": true });

const findById = (id) =>
  baseQuery()
    .select(BASE_COLS)
    .where({ "u.id_usuario": id })   // admin necesita ver también inactivos por id
    .first();

const findPasswordHash = (id) =>
  db(DatabaseTable.usuarios).select("password_hash").where({ id_usuario: id }).first();

const update = (trx, id, data) =>
  trx(DatabaseTable.usuarios)
    .where({ id_usuario: id })
    .update(data)
    .returning(["id_usuario", "nombre", "email", "cedula", "foto_perfil_url"]);

const updateRol = async (trx, id, rolCodigo) => {
  const rol = await trx(DatabaseTable.roles).where({ codigo: rolCodigo }).first();
  if (!rol) throw new Error(`Rol '${rolCodigo}' no encontrado`);
  return trx(DatabaseTable.usuarios)
    .where({ id_usuario: id })
    .update({ rol_id: rol.id })
    .returning(["id_usuario", "nombre", "email", "rol_id"]);
};

// ─── Nuevas queries para admin ───────────────────────────────────────────────

/**
 * Lista todos los usuarios con filtros opcionales.
 * @param {object} filtros
 * @param {string}  [filtros.busqueda]  - filtra por nombre o email (ILIKE)
 * @param {boolean} [filtros.activo]    - true → solo activos | false → solo inactivos | undefined → todos
 * @param {string}  [filtros.rol]       - filtra por codigo de rol
 */
const findAllAdmin = ({ busqueda, activo, rol } = {}) => {
  let query = baseQuery().select(BASE_COLS).orderBy("u.nombre", "asc");

  if (activo !== undefined) query = query.where("u.activo", activo);

  if (busqueda) {
    const like = `%${busqueda.toLowerCase()}%`;
    query = query.where((q) =>
      q.whereRaw("LOWER(u.nombre) LIKE ?", [like])
       .orWhereRaw("LOWER(u.email) LIKE ?", [like])
    );
  }

  if (rol) query = query.where("r.codigo", rol);

  return query;
};

/** Cambia el campo activo de un usuario */
const cambiarEstado = (trx, id, activo) =>
  trx(DatabaseTable.usuarios)
    .where({ id_usuario: id })
    .update({ activo })
    .returning(["id_usuario", "nombre", "email", "activo"]);

/** Eliminación física (solo admin) */
const remove = (trx, id) =>
  trx(DatabaseTable.usuarios).where({ id_usuario: id }).delete();

export default {
  // existentes
  findAll,
  findByRole,
  findById,
  findPasswordHash,
  update,
  updateRol,
  // nuevas
  findAllAdmin,
  cambiarEstado,
  remove,
};