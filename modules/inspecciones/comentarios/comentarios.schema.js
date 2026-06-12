import { z } from "zod";

export const ComentarioSchema = z.object({
  comentario: z.string().trim().min(1, "El comentario es requerido"),
});
