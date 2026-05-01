import { z } from "zod"

export const loginSchema = z.object({
    email: z.email("correo no inválido"),
    password: z
        .string()
        .min(1, "La contraseña es requerida")
})

export type LoginFormData = z.infer<typeof loginSchema>
