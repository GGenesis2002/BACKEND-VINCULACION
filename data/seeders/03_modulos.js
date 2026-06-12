import db from "../database.js";
import DatabaseTable from "../databaseTables.js";

export const seed = async () => {
  const modulos = [
    { codigo: "dashboard",    nombre: "Inicio",                orden: 1, activo: true },
    { codigo: "edificios",    nombre: "Módulo Edificios",      orden: 2, activo: true },
    { codigo: "inspecciones", nombre: "Módulo Inspecciones",   orden: 3, activo: true },
    { codigo: "usuarios",     nombre: "Gestión de Usuarios",   orden: 4, activo: true },
    { codigo: "catalogos",    nombre: "Catálogos",             orden: 5, activo: true },
    { codigo: "auditoria",    nombre: "Auditoría",             orden: 6, activo: true },
  ];

  await db(DatabaseTable.modulos).insert(modulos).onConflict("codigo").ignore();
  console.log("  ✔ modulos");
};
