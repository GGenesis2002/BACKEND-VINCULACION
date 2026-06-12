import db from "../database.js";
import DatabaseTable from "../databaseTables.js";

export const seed = async () => {
  const emails = [
    { email: "admin@vvs.com",     rol_id: 1 },
    { email: "inspector@vvs.com", rol_id: 2 },
    { email: "ayudante@vvs.com",  rol_id: 3 },
  ];

  for (const { email, rol_id } of emails) {
    const usuario = await db(DatabaseTable.usuarios).where({ email }).first();
    if (!usuario) continue;

    await db(DatabaseTable.usuariosRoles)
      .insert({ id_usuario: usuario.id_usuario, rol_id })
      .onConflict(["id_usuario", "rol_id"])
      .ignore();
  }

  console.log("  ✔ usuarios_roles");
};
