import * as utils from "../../../utils.js";
import matrizService from "./matriz.service.js";

const getAll = async (req, res) => {
  try {
    return res.status(200).json(await matrizService.getAll());
  } catch (error) { utils.ErrorManager(error, res); }
};

const getById = async (req, res) => {
  try {
    return res.status(200).json(await matrizService.getById(req.params.id));
  } catch (error) { utils.ErrorManager(error, res); }
};

export default { getAll, getById };
