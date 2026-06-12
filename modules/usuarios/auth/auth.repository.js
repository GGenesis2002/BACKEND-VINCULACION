import db from "../../../data/database.js";
import DatabaseTable from "../../../data/databaseTables.js";

const findByEmail = (email) =>
  db(DatabaseTable.usuarios)
    .select("id_usuario", "nombre", "email", "password_hash")
    .where({ email })
    .first();

const insertUsuario = (trx, data) =>
  trx(DatabaseTable.usuarios)
    .insert(data)
    .returning(["id_usuario", "nombre", "email", "cedula", "foto_perfil_url"]);

const insertToken = (idUsuario, token, expiracion) =>
  db(DatabaseTable.tokensRecuperacion).insert({ id_usuario: idUsuario, token, expiracion });

const findValidToken = (token) =>
  db(DatabaseTable.tokensRecuperacion)
    .where({ token, usado: false })
    .andWhere("expiracion", ">", new Date())
    .first();

const markTokenUsed = (token) =>
  db(DatabaseTable.tokensRecuperacion).where({ token }).update({ usado: true });

const updatePassword = (idUsuario, hash) =>
  db(DatabaseTable.usuarios).where({ id_usuario: idUsuario }).update({ password_hash: hash });

export default {
  findByEmail,
  insertUsuario,
  insertToken,
  findValidToken,
  markTokenUsed,
  updatePassword,
};
