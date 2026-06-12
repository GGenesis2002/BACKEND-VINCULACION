import db from "../database.js";
import DatabaseTable from "../databaseTables.js";

export const seed = async () => {
  const criterios = [
    { categoria: "Estructural",    descripcion_criterio: "Estado de columnas y vigas",           peso_maximo: 25.00, activo: true },
    { categoria: "Estructural",    descripcion_criterio: "Fisuras en muros de carga",             peso_maximo: 20.00, activo: true },
    { categoria: "No estructural", descripcion_criterio: "Estado de cielos rasos y luminarias",   peso_maximo: 15.00, activo: true },
    { categoria: "Sísmico",        descripcion_criterio: "Cumplimiento de código sísmico",        peso_maximo: 40.00, activo: true },
  ];

  // Idempotente: solo inserta si no existe el mismo criterio+categoría
  for (const criterio of criterios) {
    const existe = await db(DatabaseTable.matrizPuntuacion)
      .where({ descripcion_criterio: criterio.descripcion_criterio, categoria: criterio.categoria })
      .first();
    if (!existe) {
      await db(DatabaseTable.matrizPuntuacion).insert(criterio);
    }
  }

  console.log("  ✔ matriz_puntuacion");
};
