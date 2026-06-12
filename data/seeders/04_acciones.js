import db from "../database.js";
import DatabaseTable from "../databaseTables.js";

export const seed = async () => {
  const acciones = [
    { codigo: "acceso",         nombre: "Acceso al módulo" },
    { codigo: "ver",            nombre: "Ver" },
    { codigo: "crear",          nombre: "Crear" },
    { codigo: "editar",         nombre: "Editar" },
    { codigo: "eliminar",       nombre: "Eliminar" },
    { codigo: "cambiar_estado", nombre: "Cambiar estado" },
  ];

  await db(DatabaseTable.acciones).insert(acciones).onConflict("codigo").ignore();
  console.log("  ✔ acciones");
};
