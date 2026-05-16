import { useState } from "react"
import { Link as RouterLink, useNavigate } from "react-router"
import { ExclamationTriangleIcon, EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons"
import { Box, Card, Flex, Separator, Button, Link, Text, Grid, Select, Heading, IconButton, Callout, Spinner } from "@radix-ui/themes"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { FormField } from "../../components/FormField"
import { registerSchema, type RegisterFormData } from "../../schemas/register.schema"
import { useAuthStore } from "../../store/auth.store"

export const RegisterPage = () => {
  const navigate = useNavigate()
  const { register: registerUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { control, register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const isFormEmpty =
    !watch("email") ||
    !watch("password") ||
    !watch("confirmPassword") ||
    !watch("firstName") ||
    !watch("lastName") ||
    !watch("documentNumber")

  const handleRegister = async (formData: RegisterFormData) => {
    setIsLoading(true)
    setServerError(null)

    const success = await registerUser(formData)

    if (success) {
      navigate('/')
      return
    }

    setServerError("Error al crear la cuenta. Verifica que el correo y documento no estén registrados.")
    setIsLoading(false)
  }

  return (
    <Box width="700px">
      <Card size="4">
        <form onSubmit={handleSubmit(handleRegister)}>
          <Flex direction="column" gap="5">
            <Box>
              <Heading>Crear cuenta</Heading>
              <Text as="p" color="gray" weight="light">Completa el formulario para registrarte</Text>
            </Box>

            <Separator size="4" />

            {serverError && (
              <Callout.Root color="red" variant="surface">
                <Callout.Icon><ExclamationTriangleIcon /></Callout.Icon>
                <Callout.Text>{serverError}</Callout.Text>
              </Callout.Root>
            )}

            <Flex direction="column" gap="5">
              <Grid columns="2" gapY="4" gapX="3">

                <Flex direction="column" gap="2">
                  <Text as="label" weight="medium">Tipo de documento</Text>
                  <Controller
                    name="documentType"
                    control={control}
                    defaultValue="CC"
                    render={({ field }) => (
                      <Select.Root value={field.value} onValueChange={field.onChange} size="3">
                        <Select.Trigger color={errors.documentType ? "red" : undefined} />
                        <Select.Content>
                          <Select.Item value="CC">CC - Cédula de Ciudadanía</Select.Item>
                          <Select.Item value="TI">TI - Tarjeta de Identidad</Select.Item>
                          <Select.Item value="CE">CE - Cédula de Extranjería</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    )}
                  />
                </Flex>

                <FormField
                  label="Número de documento"
                  placeholder="1234567890"
                  type="text"
                  error={errors.documentNumber?.message}
                  {...register("documentNumber")}
                />

                <FormField
                  label="Nombre"
                  placeholder="Ana María"
                  type="text"
                  error={errors.firstName?.message}
                  {...register("firstName")}
                />

                <FormField
                  label="Apellido"
                  placeholder="Ramírez"
                  type="text"
                  error={errors.lastName?.message}
                  {...register("lastName")}
                />

                <FormField
                  style={{ gridColumn: "span 2" }}
                  label="Correo electrónico"
                  placeholder="nombre.apellido@uniajc.edu.co"
                  type="email"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <FormField
                  label="Contraseña"
                  placeholder="Mínimo 8 caracteres"
                  type={showPassword ? "text" : "password"}
                  rightSlot={
                    <IconButton onClick={() => setShowPassword(!showPassword)} size="2" type="button" variant="ghost" color="gray">
                      {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon height="16" width="16" />}
                    </IconButton>
                  }
                  error={errors.password?.message}
                  {...register("password")}
                />

                <FormField
                  label="Confirmar contraseña"
                  placeholder="Repite tu contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  rightSlot={
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} size="2" type="button" variant="ghost" color="gray">
                      {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon height="16" width="16" />}
                    </IconButton>
                  }
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                />
              </Grid>

              <Button style={{ cursor: 'pointer' }} size="3" type="submit" disabled={isFormEmpty || isLoading}>
                <Spinner loading={isLoading} />
                Registrarse
              </Button>
            </Flex>

            <Flex direction="column" align="center" gap="2">
              <Text size="2" color="gray">
                ¿Ya tienes cuenta?{" "}
                <Link asChild color="indigo" size="2" weight="medium" underline="none">
                  <RouterLink to="/auth/login">Inicia sesión</RouterLink>
                </Link>
              </Text>
            </Flex>
          </Flex>
        </form>
      </Card>
    </Box>
  )
}