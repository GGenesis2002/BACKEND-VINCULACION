// src/modules/asignaciones/index.js
import { Router } from "express";
import asignacionesRouter from "./asignaciones_router.js";

const asignacionesModule = Router();

asignacionesModule.use("/asignaciones", asignacionesRouter);

export default asignacionesModule;
