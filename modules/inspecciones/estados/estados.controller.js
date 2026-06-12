import * as utils from "../../../utils.js";
import estadosService from "./estados.service.js";

const getAll = async (req, res) => {
  try {
    return res.status(200).json(await estadosService.getAll());
  } catch (error) { utils.ErrorManager(error, res); }
};

export default { getAll };
