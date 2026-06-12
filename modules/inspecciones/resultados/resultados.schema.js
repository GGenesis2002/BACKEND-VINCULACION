import { z } from "zod";

export const ResultadoSchema = z.object({
  id_criterio: z.number().int(),
  valor_obtenido: z.number().default(0),
  peso_aplicado: z.number(),
  comentario_criterio: z.string().nullable().optional(),
});

export const ResultadosBulkSchema = z.object({
  resultados: z.array(ResultadoSchema).min(1, "Debe enviar al menos un resultado"),
});
