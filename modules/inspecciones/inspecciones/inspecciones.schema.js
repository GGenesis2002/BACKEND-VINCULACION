import { z } from "zod";

export const InspeccionSchema = z.object({
  id_edificio: z.number().int(),
  id_usuario: z.string().uuid(),
  fecha_inspeccion: z.string().optional(),
  estado: z.string().default("pendiente"),
  puntuacion_final: z.union([z.number(), z.string().transform(Number)]).nullable().optional(),
  observaciones_generales: z.string().nullable().optional(),
  alcance_exterior: z.string().nullable().optional(),
  alcance_interior: z.string().nullable().optional(),
  revision_planos: z.boolean().default(false),
  fuente_suelo: z.string().nullable().optional(),
  fuente_peligros: z.string().nullable().optional(),
  contacto_persona: z.string().nullable().optional(),
  requiere_nivel2: z.boolean().default(false),
  otros_peligros: z.any().nullable().optional(),
  requiere_evaluacion_detallada: z.string().nullable().optional(),
  peligro_no_estructural: z.string().nullable().optional(),
});

export const UpdateInspeccionSchema = InspeccionSchema.partial();

export const CambiarEstadoSchema = z.object({
  estado: z.string().min(1, "El estado es requerido"),
});
