import z from "zod";

export const InspectionSchema = z.object({
  id_edificio: z.number().int(),
  id_usuario: z.number().int(),
  
  alcance_exterior: z.string().nullable().optional(), 
  alcance_interior: z.string().nullable().optional(), 
  
  revision_planos: z.boolean().optional(),
  fuente_suelo: z.string().nullable().optional(),
  fuente_peligros: z.string().nullable().optional(),
  contacto_persona: z.string().nullable().optional(),
  requiere_nivel2: z.boolean().optional(),
  otros_peligros: z.any().optional(), 
  puntuacion_final: z.union([z.number(), z.string()]).nullable().optional(),
  
  // 🟢 AGREGAR ESTO: Sin esto, Zod borra los campos antes de guardar
  observaciones_generales: z.string().nullable().optional(),
  requiere_evaluacion_detallada: z.string().nullable().optional(),
  peligro_no_estructural: z.string().nullable().optional(),

  estado: z.string().default('completada')
});