import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { swaggerSpec, swaggerUiExpress } from "./swagger.js";
import usuariosModule from "./modules/usuarios/index.js";
import edificiosModule from "./modules/edificios/index.js";
import inspeccionesModule from "./modules/inspecciones/index.js";
import auditoriaModule from "./modules/auditoria/index.js";
import catalogosModule from "./modules/catalogos/index.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors("*"));

app.listen(PORT, () => {
  console.log(`\nServer started at ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Buenas :D");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Configurar keep-alive
app.use((req, res, next) => {
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=5, max=100000');
  next();
}); 



app.use(
  "/api-docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);
app.use("/api/v1", usuariosModule);
app.use("/api/v1", edificiosModule);
app.use("/api/v1", inspeccionesModule);
app.use("/api/v1", auditoriaModule);
app.use("/api/v1", catalogosModule);


