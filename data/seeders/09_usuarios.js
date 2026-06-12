import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import db from "../database.js";
import DatabaseTable from "../databaseTables.js";

const SALT_ROUNDS = 12;

const validarJwtSecrets = () => {
  const accessSecret  = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  const inseguros = ["secret", "ejemplotoken", "ejemplorefreshtoken", "changeme", "1234", "password"];

  if (!accessSecret || inseguros.includes(accessSecret.toLowerCase())) {
    throw new Error(
      "JWT_ACCESS_SECRET no está configurado o es inseguro. " +
      "Usa un secreto aleatorio de al menos 32 caracteres. " +
      "Ejemplo: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    );
  }
  if (!refreshSecret || inseguros.includes(refreshSecret.toLowerCase())) {
    throw new Error(
      "JWT_REFRESH_SECRET no está configurado o es inseguro. " +
      "Usa un secreto aleatorio de al menos 32 caracteres."
    );
  }
  if (accessSecret === refreshSecret) {
    throw new Error("JWT_ACCESS_SECRET y JWT_REFRESH_SECRET no pueden ser iguales.");
  }
};

export const seed = async () => {
  validarJwtSecrets();

  // Obtener IDs reales de roles por código (ALWAYS identity → no podemos asumir id=1,2,3)
  const roles = await db(DatabaseTable.roles).select("id", "codigo");
  const rId = (codigo) => roles.find((r) => r.codigo === codigo)?.id;

  const usuarios = [
    {
      id_usuario:    randomUUID(),
      nombre:        "Administrador Sistema",
      email:         "admin@vvs.com",
      cedula:        "0000000001",
      telefono:      "0900000001",
      password_hash: await bcrypt.hash("Admin@2024!", SALT_ROUNDS),
      rol_id:        rId("administrador"),
      activo:        true,
    },
    {
      id_usuario:    randomUUID(),
      nombre:        "Inspector Demo",
      email:         "inspector@vvs.com",
      cedula:        "0000000002",
      telefono:      "0900000002",
      password_hash: await bcrypt.hash("Inspector@2024!", SALT_ROUNDS),
      rol_id:        rId("inspector"),
      activo:        true,
    },
    {
      id_usuario:    randomUUID(),
      nombre:        "Ayudante Demo",
      email:         "ayudante@vvs.com",
      cedula:        "0000000003",
      telefono:      "0900000003",
      password_hash: await bcrypt.hash("Ayudante@2024!", SALT_ROUNDS),
      rol_id:        rId("ayudante"),
      activo:        true,
    },
  ];

  for (const usuario of usuarios) {
    const existe = await db(DatabaseTable.usuarios).where({ email: usuario.email }).first();

    if (!existe) {
      await db(DatabaseTable.usuarios).insert(usuario);
    } else if (!existe.password_hash) {
      // Usuario creado sin hash (corrida anterior fallida) → actualizar
      await db(DatabaseTable.usuarios)
        .where({ email: usuario.email })
        .update({
          password_hash: usuario.password_hash,
          rol_id:        usuario.rol_id,
          activo:        true,
        });
    }
  }

  console.log("  ✔ usuarios (contraseñas cifradas con bcrypt rounds=12)");
  console.log("    admin@vvs.com      → Admin@2024!");
  console.log("    inspector@vvs.com  → Inspector@2024!");
  console.log("    ayudante@vvs.com   → Ayudante@2024!");
};
