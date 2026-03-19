import z from "zod";

export const LoginSchema = z.object({
  email: z.string().trim().min(1, "El correo es requerido"),
  password: z.string().trim().min(1, "La contraseña es requerida"),
});

export const RegisterSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es requerido")
    .min(5, "El nombre debe tener al menos 5 caracteres"),
  email: z
    .string()
    .trim()
    .min(1, "El correo es requerido")
    .email("El correo no es válido"),
  password: z
    .string()
    .trim()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .regex(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
    .regex(/[0-9]/, "La contraseña debe tener al menos un número"),
  cedula: z
    .string()
    .trim()
    .min(1, "La cédula es requerida")
    .min(6, "La cédula debe tener al menos 10 caracteres"),
  rol: z
    .enum(["admin", "inspector", "ayudante"], {
      errorMap: () => ({
        message:
          "El rol es requerido y debe ser admin, inspector o ayudante",
      }),
    })
    .optional(),
  telefono: z
    .string()
    .trim()
    .min(1, "El número de teléfono es requerido")
    .max(10, "El número de teléfono no debe superar 10 dígitos"),
});

export const UserProfilePictureSchema = z.object({
  foto_perfil: z
    .custom((file) => file && file.buffer, "Debe subir una foto de perfil")
    .refine(
      (file) => ["image/jpeg", "image/png"].includes(file?.mimetype),
      "El archivo debe ser una imagen JPG o PNG"
    ),
});
