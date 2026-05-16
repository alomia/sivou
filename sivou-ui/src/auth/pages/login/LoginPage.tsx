import { useState } from "react"


import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link as RouterLink, useNavigate } from "react-router"
import { Box, Button, Callout, Card, Flex, IconButton, Link, Separator, Spinner, Text } from "@radix-ui/themes"
import { EnvelopeClosedIcon, ExclamationTriangleIcon, EyeClosedIcon, EyeOpenIcon, LockClosedIcon } from "@radix-ui/react-icons"

import { AuthHeader } from "../../components/AuthHeader"
import { FormField } from "../../components/FormField"
import { loginSchema, type LoginFormData } from "../../schemas/login.schema"
import { useAuthStore } from "../../store/auth.store"

export const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const { login } = useAuthStore();


  const emailValue = watch("email")
  const passwordValue = watch("password")
  const isFormEmpty = !emailValue || !passwordValue

  const handleLogin = async (formData: LoginFormData) => {
    setIsLoading(true)
    setServerError(null)

    const isSucces = await login(formData.email, formData.password)

    if (isSucces) {
      navigate('/')
      return
    }

    setServerError("Correo o contraseña incorrectos")
    setIsLoading(false)

  }

  return (
    <Box width="450px">

      <Card size="4">
        <form onSubmit={handleSubmit(handleLogin)}>

          <Flex direction="column" gap="5">
            <AuthHeader title="SIVOU" subtitle="Sistema de Votación Universitario" align="center" />

            <Separator size="4" />

            {serverError && (
              <Callout.Root color="red" variant="surface">
                <Callout.Icon>
                  <ExclamationTriangleIcon />
                </Callout.Icon>
                <Callout.Text>{serverError}</Callout.Text>
              </Callout.Root>
            )}

            <Flex direction="column" gap="5">
              <FormField
                label="Correo institucional"
                placeholder="nombre.apellido@uniajc.edu.co"
                type="email"
                error={errors.email?.message}
                leftSlot={<EnvelopeClosedIcon height="16" width="16" />}
                {...register('email')}
              />

              <FormField
                label="Contraseña"
                placeholder="Tu contraseña"
                type={showPassword ? "text" : "password"}
                leftSlot={<LockClosedIcon height="16" width="16" />}
                error={errors.password?.message}
                rightSlot={
                  <IconButton
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    size="2"
                    variant="ghost"
                    color="gray">
                    {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon height="16" width="16" />}
                  </IconButton>
                }
                {...register('password')}
              />

              <Button
                style={{ cursor: isFormEmpty || isLoading ? 'not-allowed' : 'pointer' }}
                size="3"
                disabled={isFormEmpty || isLoading}
              >
                <Spinner loading={isLoading} />
                Iniciar sesión
              </Button>
            </Flex>

            <Flex direction="column" align="center" gap="2">
              <Link size="2" underline="none">
                ¿Olvidaste tu contraseña
              </Link>
              <Text size="2" color="gray">
                ¿No tienes cuenta?{" "}
                <Link asChild
                  color="indigo"
                  size="2"
                  weight="medium"
                  underline="none">
                  <RouterLink to="/auth/register">Regístrate</RouterLink>
                </Link>
              </Text>
            </Flex>
          </Flex>
        </form>
      </Card>
    </Box>
  )
}
