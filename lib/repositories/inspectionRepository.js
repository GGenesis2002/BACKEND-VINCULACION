import db from "../../data/database.js";
import DatabaseTable from "../../data/databaseTables.js";
import AnomalyCode from "../../anomaly.js";
import * as utils from "../../utils.js";

const postInspection = async (inspectionData) => {
  const trx = await db.transaction();
  try {
    const [inspection] = await trx(DatabaseTable.inspecciones)
      .insert(inspectionData)
      .returning("*");

    await trx.commit();
    return inspection;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

export default { postInspection };