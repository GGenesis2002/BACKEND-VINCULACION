import * as utils from "../../utils.js";
import db from "../../data/database.js";
import AnomalyCode from "../../anomaly.js";
import DatabaseTable from "../../data/databaseTables.js";

const getByType = async (type, filter) => {
  try {
    let query = db(DatabaseTable.catalogos)
      .select("id_catalogo", "tipo", "codigo", "valor")
      .where({ tipo: type });

    if (filter) {
      query = query.whereRaw("LOWER(valor) LIKE ?", [`%${filter.toLowerCase()}%`]);
    }

    return await query;
  } catch (error) {
    throw new utils.CustomError(AnomalyCode.dataBaseError, "Error al obtener los catálogos");
  }
};

export default { getByType };
