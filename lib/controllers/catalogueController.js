import * as utils from "../../utils.js";
import AnomalyCode from "../../anomaly.js";
import catalogueService from "../service/catalogueService.js";

const getCataloguesByType = async (req, res) => {
  const { type } = req.params;
  const { filter } = req.query;
  try {
    const catalogues = await catalogueService.getCataloguesByType(type, filter);
    return res.status(200).json(catalogues);
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener los catálogos"
    );
  }
};

const catalogueController = { getCataloguesByType };

export default catalogueController;
