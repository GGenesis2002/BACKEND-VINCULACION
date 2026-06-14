import { z } from "zod";

/** Body para crear una asignación.
 *  El inspector busca un edificio (id_edificio) y escribe la cédula del ayudante. */
export const AsignacionSchema = z.object({
  id_edificio: z
    .union([z.number().int(), z.string().transform(Number)])
    .refine((v) => !isNaN(v) && v > 0, "id_edificio debe ser un entero positivo"),

  cedula_ayudante: z
    .string()
    .trim()
    .min(5, "La cédula debe tener al menos 5 caracteres"),
});

/** Body para revocar / reactivar */
export const CambiarEstadoAsignacionSchema = z.object({
  estado: z.enum(["activa", "revocada"], {
    errorMap: () => ({ message: "El estado debe ser 'activa' o 'revocada'" }),
  }),
});
