import db from "../../data/database.js";
import DatabaseTable from "../../data/databaseTables.js";
import * as utils from "../../utils.js";

const addSession = async (req, res, next) => {
  try {
    let data = await db
      .from({ u: DatabaseTable.usuarios })
      .select({
        id: "u.id_usuario",
        nombre: "u.nombre",
        email: "u.email",
      })
      .where("u.id_usuario", req.user.id)
      .first();

    if (data == null) throw new Error();

    let session = {
      user: {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
      },
    };

    req.session = session;

    return next();
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const sessionMiddleware = { addSession };
export default sessionMiddleware;
