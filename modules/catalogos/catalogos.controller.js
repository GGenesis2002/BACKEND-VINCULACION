import * as utils from "../../utils.js";
import AnomalyCode from "../../anomaly.js";
import catalogosService from "./catalogos.service.js";

const getCataloguesByType = async (req, res) => {
  const { type } = req.params;
  const { filter } = req.query;
  try {
    const catalogues = await catalogosService.getCataloguesByType(type, filter);
    return res.status(200).json(catalogues);
  } catch (error) {
    throw new utils.CustomError(AnomalyCode.dataBaseError, "Error al obtener los catálogos");
  }
};

export default { getCataloguesByType };
