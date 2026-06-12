import { Router } from "express";
import catalogosRouter from "./catalogos.router.js";

const router = Router();
router.use("/catalogues", catalogosRouter);

export default router;
