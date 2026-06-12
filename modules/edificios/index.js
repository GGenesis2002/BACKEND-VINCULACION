import { Router } from "express";
import edificiosRouter from "./edificios/edificios.router.js";

const edificiosModule = Router();

edificiosModule.use("/edificios", edificiosRouter);

export default edificiosModule;
