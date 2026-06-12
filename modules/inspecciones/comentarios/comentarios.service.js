import db from "../../../data/database.js";
import * as utils from "../../../utils.js";
import AnomalyCode from "../../../anomaly.js";
import { ComentarioSchema } from "./comentarios.schema.js";
import comentariosRepository from "./comentarios.repository.js";

const getByInspeccion = (idInspeccion) => comentariosRepository.findByInspeccion(idInspeccion);

const create = async (idInspeccion, idUsuario, body) => {
  const { comentario } = ComentarioSchema.parse(body);
  const trx = await db.transaction();
  try {
    const [nuevo] = await comentariosRepository.insert(trx, {
      id_inspeccion: parseInt(idInspeccion),
      id_usuario: idUsuario,
      comentario,
    });
    await trx.commit();
    return nuevo;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const remove = async (idComentario) => {
  const comentario = await comentariosRepository.findById(idComentario);
  if (!comentario) throw new utils.CustomError(AnomalyCode.notFound, "Comentario no encontrado");

  const trx = await db.transaction();
  try {
    await comentariosRepository.remove(trx, idComentario);
    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

export default { getByInspeccion, create, remove };
