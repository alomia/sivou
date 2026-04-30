import { useState } from "react"

import { Link as RouterLink } from "react-router"
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons"
import { Box, Card, Flex, Separator, Button, Link, Text, Grid, Select, Heading, IconButton } from "@radix-ui/themes"

import { FormField } from "../../components/FormField"

export const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <Box width="700px">

      <Card size="4">
        <Flex direction="column" gap="5">
          <Box>
            <Heading>Crear cuenta</Heading>
            <Text as="p" color="gray" weight="light">Completa el formulario para registrarte</Text>
          </Box>

          <Separator size="4" />

          <Flex direction="column" gap="5">

            <Grid columns="2" gapY="4" gapX="3" >

              <Flex direction="column" gap="2">
                <Text as="label" weight="medium">Tipo de documento</Text>
                <Select.Root size="3" defaultValue="cc">
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="cc">CC - Cédula de Ciudadanía</Select.Item>
                    <Select.Item value="ti">TI - Tarjeta de Identidad</Select.Item>
                    <Select.Item value="ce">CE - Cédula de Extranjería</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>


              <FormField
                label="Número de documento"
                placeholder="1234567890"
                type="text"
              />

              <FormField
                label="Nombre"
                placeholder="Ana María"
                type="text"
              />

              <FormField
                label="Apellido"
                placeholder="Ramírez"
                type="text"
              />

              <FormField
                style={{ gridColumn: "span 2" }}
                label="Correo electrónico"
                placeholder="nombre.apellido@uniajc.edu.co"
                type="email"
              />

              <FormField
                label="Contraseña"
                placeholder="Mínimo 8 caracteres"
                type={showPassword ? "text" : "password"}
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

              <FormField
                label="Confirmar contraseña"
                placeholder="Repite tu contraseña"
                type={showPassword ? "text" : "password"}
                rightSlot={
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    size="2"
                    variant="ghost"
                    color="gray">
                    {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon height="16" width="16" />}
                  </IconButton>
                }
              />

            </Grid>

            <Button style={{ cursor: 'pointer' }} size="3" type="submit">
              Registrarse
            </Button>
          </Flex>

          <Flex direction="column" align="center" gap="2">
            <Text size="2" color="gray">
              ¿Ya tienes cuenta?{" "}
              <Link asChild
                color="indigo"
                size="2"
                weight="medium"
                underline="none">
                <RouterLink to="/auth/login">Inicia sesión</RouterLink>
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Card>
    </Box>
  )
}
