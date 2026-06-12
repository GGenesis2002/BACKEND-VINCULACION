import db from "../../../data/database.js";
import * as utils from "../../../utils.js";
import AnomalyCode from "../../../anomaly.js";
import { ResultadosBulkSchema } from "./resultados.schema.js";
import resultadosRepository from "./resultados.repository.js";

const getByInspeccion = (idInspeccion) => resultadosRepository.findByInspeccion(idInspeccion);

const saveBulk = async (idInspeccion, body) => {
  const { resultados } = ResultadosBulkSchema.parse(body);
  const rows = resultados.map((r) => ({ ...r, id_inspeccion: parseInt(idInspeccion) }));

  const trx = await db.transaction();
  try {
    const inserted = await resultadosRepository.insertBulk(trx, rows);
    await trx.commit();
    return inserted;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const update = async (idResultado, body) => {
  const trx = await db.transaction();
  try {
    const [resultado] = await resultadosRepository.update(trx, idResultado, body);
    await trx.commit();
    return resultado;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const remove = async (idResultado) => {
  const trx = await db.transaction();
  try {
    await resultadosRepository.remove(trx, idResultado);
    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

export default { getByInspeccion, saveBulk, update, remove };
