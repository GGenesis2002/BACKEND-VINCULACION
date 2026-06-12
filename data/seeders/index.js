import dotenv from "dotenv";
dotenv.config({ override: true });

import { seed as seedRoles }             from "./01_roles.js";
import { seed as seedEstados }           from "./02_estados_inspeccion.js";
import { seed as seedModulos }           from "./03_modulos.js";
import { seed as seedAcciones }          from "./04_acciones.js";
import { seed as seedOpciones }          from "./05_opciones.js";
import { seed as seedOpcionAcciones }    from "./06_opcion_acciones.js";
import { seed as seedRolPermisos }       from "./07_rol_permisos.js";
import { seed as seedMatriz }            from "./08_matriz_puntuacion.js";
import { seed as seedUsuarios }          from "./09_usuarios.js";
import { seed as seedUsuariosRoles }     from "./10_usuarios_roles.js";
import db from "../database.js";

const run = async () => {
  console.log("\n Ejecutando seeders...\n");
  try {
    await seedRoles();
    await seedEstados();
    await seedModulos();
    await seedAcciones();
    await seedOpciones();
    await seedOpcionAcciones();
    await seedRolPermisos();
    await seedMatriz();
    await seedUsuarios();
    await seedUsuariosRoles();

    console.log("\n Seeders completados exitosamente.\n");
  } catch (error) {
    console.error("\n Error en seeders:", error.message);
    process.exit(1);
  } finally {
    await db.destroy();
  }
};

run();
