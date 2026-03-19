import * as utils from "../../utils.js";
import AnomalyCode from "../../anomaly.js";
import catalogueRepository from "../repositories/catalogueRepository.js";

const getCataloguesByType = async (type, filter) => {
  try {
    const catalogues = await catalogueRepository.getByType(type, filter);
    return catalogues;
  } catch (error) {
    console.log(error);
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener los catálogos"
    );
  }
};

const catalogueService = { getCataloguesByType };

export default catalogueService;
