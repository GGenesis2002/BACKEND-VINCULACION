import db from "../database.js";
import DatabaseTable from "../databaseTables.js";

export const seed = async () => {
  const estados = [
    { codigo: "pendiente",    nombre: "Pendiente",    descripcion: "Inspección creada, aún no iniciada", orden: 1, activo: true },
    { codigo: "en_progreso",  nombre: "En progreso",  descripcion: "Inspección en ejecución",             orden: 2, activo: true },
    { codigo: "completada",   nombre: "Completada",   descripcion: "Inspección finalizada",               orden: 3, activo: true },
    { codigo: "cancelada",    nombre: "Cancelada",    descripcion: "Inspección cancelada",                orden: 4, activo: true },
  ];

  await db(DatabaseTable.estadosInspeccion).insert(estados).onConflict("codigo").ignore();
  console.log("  ✔ estados_inspeccion");
};
