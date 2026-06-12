import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().trim().min(1, "El correo es requerido"),
  password: z.string().trim().min(1, "La contraseña es requerida"),
});

export const RegisterSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(5, "El nombre debe tener al menos 5 caracteres"),
  email: z.string().trim().email("El correo no es válido"),
  password: z
    .string()
    .trim()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .regex(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
    .regex(/[0-9]/, "La contraseña debe tener al menos un número"),
  cedula: z.string().trim().min(6, "La cédula debe tener al menos 6 caracteres"),
  rol: z
    .enum(["administrador", "inspector", "ayudante"], {
      errorMap: () => ({ message: "El rol debe ser administrador, inspector o ayudante" }),
    })
    .optional(),
  telefono: z.string().trim().max(10, "El teléfono no debe superar 10 dígitos"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().trim().email("El correo no es válido"),
});

export const ResetPasswordSchema = z.object({
  token: z.string().trim().min(1, "El token es requerido"),
  newPassword: z
    .string()
    .trim()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const ProfilePictureSchema = z.object({
  foto_perfil: z
    .custom((file) => file && file.buffer, "Debe subir una foto de perfil")
    .refine(
      (file) => ["image/jpeg", "image/png"].includes(file?.mimetype),
      "El archivo debe ser una imagen JPG o PNG"
    ),
});
