import * as utils from "../../utils.js";
import AnomalyCode from "../../anomaly.js";
import catalogosRepository from "./catalogos.repository.js";

const getCataloguesByType = async (type, filter) => {
  try {
    return await catalogosRepository.getByType(type, filter);
  } catch (error) {
    console.log(error);
    throw new utils.CustomError(AnomalyCode.dataBaseError, "Error al obtener los catálogos");
  }
};

export default { getCataloguesByType };
