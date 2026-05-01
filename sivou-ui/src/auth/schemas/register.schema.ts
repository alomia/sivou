import { z } from "zod"

export const registerSchema = z.object({
  documentType: z.string().min(1, "El tipo de documento es obligatorio"),

  documentNumber: z.string()
    .min(1, "El número de documento es obligatorio")
    .regex(/^\d+$/, "El número de documento solo puede contener números"),

  firstName: z.string()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre no puede superar los 100 caracteres"),

  lastName: z.string()
    .min(1, "El apellido es obligatorio")
    .max(100, "El apellido no puede superar los 100 caracteres"),

  email: z.email("El formato del correo institucional es inválido"),

  password: z.string()
    .min(1, "La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),

  confirmPassword: z.string()
    .min(1, "La confirmación de contraseña es obligatoria"),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  }
)

export type RegisterFormData = z.infer<typeof registerSchema>
