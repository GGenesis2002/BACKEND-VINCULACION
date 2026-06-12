import db from "../database.js";
import DatabaseTable from "../databaseTables.js";

export const seed = async () => {
  const roles = [
    { nombre: "administrador", codigo: "administrador", descripcion: "Acceso total al sistema",             activo: true },
    { nombre: "inspector",     codigo: "inspector",     descripcion: "Crea y edita edificios e inspecciones", activo: true },
    { nombre: "ayudante",      codigo: "ayudante",      descripcion: "Acceso de solo lectura / apoyo",        activo: true },
  ];

  await db(DatabaseTable.roles).insert(roles).onConflict("codigo").ignore();
  console.log("  ✔ roles");
};
