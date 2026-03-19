import * as utils from "../../utils.js";
import inspectionService from "../service/inspectionService.js";

const postInspection = async (req, res) => {
  try {
    const newInspection = await inspectionService.postInspection(req.body);
    return res.status(201).json({
      success: true,
      message: "Inspección guardada exitosamente",
      data: newInspection
    });
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export default { postInspection };