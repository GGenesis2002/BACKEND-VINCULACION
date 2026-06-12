import db from "../database.js";
import DatabaseTable from "../databaseTables.js";

export const seed = async () => {
  const roles     = await db(DatabaseTable.roles).select("id", "codigo");
  const opciones  = await db(DatabaseTable.opciones).select("id", "codigo");
  const acciones  = await db(DatabaseTable.acciones).select("id", "codigo");
  const opcionAcc = await db(DatabaseTable.opcionAcciones).select("id", "opcion_id", "accion_id");

  const rId = (codigo) => roles.find((r) => r.codigo === codigo)?.id;
  const oId = (codigo) => opciones.find((o) => o.codigo === codigo)?.id;
  const aId = (codigo) => acciones.find((a) => a.codigo === codigo)?.id;
  const oaId = (opcion, accion) =>
    opcionAcc.find((oa) => oa.opcion_id === oId(opcion) && oa.accion_id === aId(accion))?.id;

  const permisos = [
    // administrador → todo
    ...["dashboard","edificios","inspecciones","usuarios","catalogos","auditoria"].map((o) => ({ rol: "administrador", opcion: o, accion: "acceso" })),
    { rol: "administrador", opcion: "edificios",    accion: "ver" },
    { rol: "administrador", opcion: "edificios",    accion: "crear" },
    { rol: "administrador", opcion: "edificios",    accion: "editar" },
    { rol: "administrador", opcion: "edificios",    accion: "eliminar" },
    { rol: "administrador", opcion: "inspecciones", accion: "ver" },
    { rol: "administrador", opcion: "inspecciones", accion: "crear" },
    { rol: "administrador", opcion: "inspecciones", accion: "editar" },
    { rol: "administrador", opcion: "inspecciones", accion: "eliminar" },
    { rol: "administrador", opcion: "inspecciones", accion: "cambiar_estado" },
    { rol: "administrador", opcion: "usuarios",     accion: "ver" },
    { rol: "administrador", opcion: "usuarios",     accion: "crear" },
    { rol: "administrador", opcion: "usuarios",     accion: "editar" },
    { rol: "administrador", opcion: "usuarios",     accion: "cambiar_estado" },
    { rol: "administrador", opcion: "catalogos",    accion: "ver" },
    { rol: "administrador", opcion: "catalogos",    accion: "editar" },
    { rol: "administrador", opcion: "auditoria",    accion: "ver" },
    // inspector
    { rol: "inspector", opcion: "dashboard",    accion: "acceso" },
    { rol: "inspector", opcion: "edificios",    accion: "acceso" },
    { rol: "inspector", opcion: "edificios",    accion: "ver" },
    { rol: "inspector", opcion: "edificios",    accion: "crear" },
    { rol: "inspector", opcion: "edificios",    accion: "editar" },
    { rol: "inspector", opcion: "inspecciones", accion: "acceso" },
    { rol: "inspector", opcion: "inspecciones", accion: "ver" },
    { rol: "inspector", opcion: "inspecciones", accion: "crear" },
    { rol: "inspector", opcion: "inspecciones", accion: "editar" },
    { rol: "inspector", opcion: "inspecciones", accion: "cambiar_estado" },
    // ayudante
    { rol: "ayudante", opcion: "dashboard",    accion: "acceso" },
    { rol: "ayudante", opcion: "edificios",    accion: "acceso" },
    { rol: "ayudante", opcion: "edificios",    accion: "ver" },
    { rol: "ayudante", opcion: "inspecciones", accion: "ver" },
  ];

  for (const { rol, opcion, accion } of permisos) {
    const rol_id         = rId(rol);
    const opcion_accion_id = oaId(opcion, accion);
    if (!rol_id || !opcion_accion_id) continue;

    const existe = await db(DatabaseTable.rolPermisos).where({ rol_id, opcion_accion_id }).first();
    if (!existe) {
      await db(DatabaseTable.rolPermisos).insert({ rol_id, opcion_accion_id });
    }
  }

  console.log("  ✔ rol_permisos");
};
