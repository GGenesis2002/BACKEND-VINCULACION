import { Router } from "express";
import auditoriaRouter from "./auditoria.router.js";

const auditoriaModule = Router();

auditoriaModule.use("/auditoria", auditoriaRouter);

export default auditoriaModule;
