import { z } from "zod";

export const UpdateUsuarioSchema = z
  .object({
    nombre: z.string().trim().min(5, "El nombre debe tener al menos 5 caracteres").optional(),
    email: z.string().trim().email("El correo no es válido").optional(),
    cedula: z.string().trim().regex(/^\d{10}$/, "La cédula debe tener 10 dígitos").optional(),
    telefono: z.string().trim().max(10, "El teléfono no debe superar 10 dígitos").optional(),
    direccion: z.string().trim().optional(),
    currentPassword: z.string().trim().optional(),
    password: z
      .string()
      .trim()
      .min(6, "La nueva contraseña debe tener al menos 6 caracteres")
      .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
      .regex(/[0-9]/, "Debe tener al menos un número")
      .optional(),
  })
  .refine(
    (data) => !(data.password && !data.currentPassword),
    { message: "Debe proporcionar la contraseña actual para cambiarla", path: ["currentPassword"] }
  );

export const UpdateRolSchema = z.object({
  rol: z.enum(["admin", "inspector", "ayudante"], {
    errorMap: () => ({ message: "El rol debe ser admin, inspector o ayudante" }),
  }),
});
