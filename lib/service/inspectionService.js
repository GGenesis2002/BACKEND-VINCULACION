import { InspectionSchema } from "../schema/inspectionSchema.js";
import inspectionRepos from "../repositories/inspectionRepository.js";

const postInspection = async (inspectionData) => {
  const dataToParse = {
    ...inspectionData,
    id_edificio: parseInt(inspectionData.id_edificio),
    id_usuario: parseInt(inspectionData.id_usuario),
    puntuacion_final: inspectionData.puntuacion_final ? parseFloat(inspectionData.puntuacion_final) : null,
    
    // Normalización de booleanos
    revision_planos: String(inspectionData.revision_planos) === 'true',
    requiere_nivel2: String(inspectionData.requiere_nivel2) === 'true',

    // Parseo de JSON si es necesario
    otros_peligros: typeof inspectionData.otros_peligros === "string" 
      ? JSON.parse(inspectionData.otros_peligros) 
      : inspectionData.otros_peligros,

    // Mapeo explícito
    observaciones_generales: inspectionData.observaciones_generales || null,
    requiere_evaluacion_detallada: inspectionData.requiere_evaluacion_detallada || null,
    peligro_no_estructural: inspectionData.peligro_no_estructural || null
  };

  // Ahora parsedData SI contendrá las nuevas columnas porque ya están en el Schema
  const parsedData = InspectionSchema.parse(dataToParse);
  
  return await inspectionRepos.postInspection(parsedData);
};

export default { postInspection };