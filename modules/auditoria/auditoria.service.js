import * as utils from "../../utils.js";
import AnomalyCode from "../../anomaly.js";
import auditoriaRepository from "./auditoria.repository.js";

const getAll = ({ tabla, idUsuario, desde, hasta, limit, offset } = {}) =>
  auditoriaRepository.findAll({ tabla, idUsuario, desde, hasta, limit, offset });

const getById = async (id) => {
  const log = await auditoriaRepository.findById(id);
  if (!log) throw new utils.CustomError(AnomalyCode.notFound, "Registro de auditoría no encontrado");
  return log;
};

const getTablas = () => auditoriaRepository.findTablas();

export default { getAll, getById, getTablas };
