import { useState } from "react"

import { Link as RouterLink } from "react-router"
import { Box, Button, Card, Flex, IconButton, Link, Separator, Text } from "@radix-ui/themes"
import { EnvelopeClosedIcon, EyeClosedIcon, EyeOpenIcon, LockClosedIcon } from "@radix-ui/react-icons"

import { AuthHeader } from "../../components/AuthHeader"
import { FormField } from "../../components/FormField"

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Box width="450px">

      <Card size="4">
        <Flex direction="column" gap="5">
          <AuthHeader title="SIVOU" subtitle="Sistema de Votación Universitario" align="center" />

          <Separator size="4" />

          <Flex direction="column" gap="5">
            <FormField
              label="Correo institucional"
              placeholder="nombre.apellido@uniajc.edu.co"
              type="email"
              leftSlot={<EnvelopeClosedIcon height="16" width="16" />}
            />

            <FormField
              label="Contraseña"
              placeholder="Tu contraseña"
              type={showPassword ? "text" : "password"}
              leftSlot={<LockClosedIcon height="16" width="16" />}
              rightSlot={
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  size="2"
                  variant="ghost"
                  color="gray">
                  {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon height="16" width="16" />}
                </IconButton>
              }
            />

            <Button style={{ cursor: 'pointer' }} size="3">
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
      </Card>
    </Box>
  )
}
