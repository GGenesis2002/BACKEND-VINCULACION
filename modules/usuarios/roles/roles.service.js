import db from "../../../data/database.js";
import * as utils from "../../../utils.js";
import AnomalyCode from "../../../anomaly.js";
import rolesRepository from "./roles.repository.js";

const getAll = () => rolesRepository.findAll();

const getByUsuario = async (idUsuario) => {
  const roles = await rolesRepository.findByUsuario(idUsuario);
  return roles;
};

const assignRol = async (idUsuario, idRol) => {
  const rol = await rolesRepository.findById(idRol);
  if (!rol) throw new utils.CustomError(AnomalyCode.notFound, "Rol no encontrado");

  const trx = await db.transaction();
  try {
    await rolesRepository.assignRol(trx, idUsuario, idRol);
    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const removeRol = async (idUsuario, idRol) => {
  const trx = await db.transaction();
  try {
    await rolesRepository.removeRol(trx, idUsuario, idRol);
    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

export default { getAll, getByUsuario, assignRol, removeRol };
