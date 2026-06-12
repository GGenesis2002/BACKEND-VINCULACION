import { Router } from "express";
import inspeccionesRouter from "./inspecciones/inspecciones.router.js";
import estadosRouter from "./estados/estados.router.js";
import matrizRouter from "./matriz/matriz.router.js";

const inspeccionesModule = Router();

inspeccionesModule.use("/inspecciones", inspeccionesRouter);
inspeccionesModule.use("/estados-inspeccion", estadosRouter);
inspeccionesModule.use("/matriz-puntuacion", matrizRouter);

export default inspeccionesModule;
