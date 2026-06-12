import db from "../database.js";
import DatabaseTable from "../databaseTables.js";

export const seed = async () => {
  const opciones = await db(DatabaseTable.opciones).select("id", "codigo");
  const acciones = await db(DatabaseTable.acciones).select("id", "codigo");

  const oId = (codigo) => opciones.find((o) => o.codigo === codigo)?.id;
  const aId = (codigo) => acciones.find((a) => a.codigo === codigo)?.id;

  const combinaciones = [
    { opcion: "dashboard",    accion: "acceso" },
    { opcion: "edificios",    accion: "acceso" },
    { opcion: "inspecciones", accion: "acceso" },
    { opcion: "usuarios",     accion: "acceso" },
    { opcion: "catalogos",    accion: "acceso" },
    { opcion: "auditoria",    accion: "acceso" },
    { opcion: "edificios",    accion: "ver" },
    { opcion: "edificios",    accion: "crear" },
    { opcion: "edificios",    accion: "editar" },
    { opcion: "edificios",    accion: "eliminar" },
    { opcion: "inspecciones", accion: "ver" },
    { opcion: "inspecciones", accion: "crear" },
    { opcion: "inspecciones", accion: "editar" },
    { opcion: "inspecciones", accion: "eliminar" },
    { opcion: "inspecciones", accion: "cambiar_estado" },
    { opcion: "usuarios",     accion: "ver" },
    { opcion: "usuarios",     accion: "crear" },
    { opcion: "usuarios",     accion: "editar" },
    { opcion: "usuarios",     accion: "cambiar_estado" },
    { opcion: "catalogos",    accion: "ver" },
    { opcion: "catalogos",    accion: "editar" },
    { opcion: "auditoria",    accion: "ver" },
  ];

  for (const { opcion, accion } of combinaciones) {
    const opcion_id = oId(opcion);
    const accion_id = aId(accion);
    const existe = await db(DatabaseTable.opcionAcciones).where({ opcion_id, accion_id }).first();
    if (!existe) {
      await db(DatabaseTable.opcionAcciones).insert({ opcion_id, accion_id });
    }
  }

  console.log("  ✔ opcion_acciones");
};
