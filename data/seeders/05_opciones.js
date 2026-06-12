import db from "../database.js";
import DatabaseTable from "../databaseTables.js";

export const seed = async () => {
  // Buscar IDs de módulos por código
  const modulos = await db(DatabaseTable.modulos).select("id", "codigo");
  const mId = (codigo) => modulos.find((m) => m.codigo === codigo)?.id;

  const opciones = [
    { modulo_id: mId("dashboard"),    codigo: "dashboard",    nombre: "Inicio",              icono: "home",               ruta: "/dashboard",    orden: 1, activo: true },
    { modulo_id: mId("edificios"),    codigo: "edificios",    nombre: "Edificios",           icono: "apartment",          ruta: "/edificios",    orden: 2, activo: true },
    { modulo_id: mId("inspecciones"), codigo: "inspecciones", nombre: "Inspecciones",        icono: "assignment",         ruta: "/inspecciones", orden: 3, activo: true },
    { modulo_id: mId("usuarios"),     codigo: "usuarios",     nombre: "Usuarios",            icono: "people",             ruta: "/usuarios",     orden: 4, activo: true },
    { modulo_id: mId("catalogos"),    codigo: "catalogos",    nombre: "Catálogos",           icono: "category",           ruta: "/catalogos",    orden: 5, activo: true },
    { modulo_id: mId("auditoria"),    codigo: "auditoria",    nombre: "Auditoría",           icono: "manage_search",      ruta: "/auditoria",    orden: 6, activo: true },
  ];

  // UPSERT: merge actualiza nombre/icono/ruta si ya existen
  await db(DatabaseTable.opciones)
    .insert(opciones)
    .onConflict("codigo")
    .merge(["modulo_id", "nombre", "icono", "ruta", "orden", "activo"]);
  console.log("  ✔ opciones");
};
