import { Link as RouterLink } from "react-router"
import { EnvelopeClosedIcon, EyeOpenIcon, LockClosedIcon } from "@radix-ui/react-icons"
import { Box, Button, Card, Container, Flex, Heading, IconButton, Link, Separator, Text, TextField } from "@radix-ui/themes"
import { usePageTitle } from "../../hooks/usePageTitle"

export const LoginPage = () => {
  usePageTitle("Iniciar sesión")

  return (
    <>
      <Container>
        <Flex direction="column" justify="center" align="center" gap="5" height="100vh">

          <Box width="450px">
            <Card>
              <Box p="5">
                <Flex direction="column" gap="5">
                  <Flex direction="column" gap="1">
                    <Heading style={{ letterSpacing: 10 }} weight="bold" size="8" align="center" >SIVOU</Heading>
                    <Text color="gray" weight="light" align="center">Sistema de Votación Universitario</Text>
                  </Flex>

                  <Separator size="4" />

                  <Flex direction="column">
                    <Text weight="medium" mb="2">Correo institucional</Text>
                    <TextField.Root size="3" placeholder="nombre.apellido@uniajc.edu.co" type="email">
                      <TextField.Slot>
                        <EnvelopeClosedIcon height="16" width="16" />
                      </TextField.Slot>
                    </TextField.Root>
                  </Flex>

                  <Flex direction="column">
                    <Text weight="medium" mb="2">Contraseña</Text>
                    <TextField.Root size="3" placeholder="Tu contraseña" type="password">
                      <TextField.Slot>
                        <LockClosedIcon height="16" width="16" />
                      </TextField.Slot>
                      <TextField.Slot side="right" pr="3">
                      <IconButton size="2" variant="ghost" color="gray">
                        <EyeOpenIcon height="16" width="16" />
                      </IconButton>
                    </TextField.Slot>
                    </TextField.Root>
                  </Flex>

                  <Button style={{ cursor: 'pointer' }} size="3">
                    Iniciar sesión
                  </Button>
                </Flex>

                <Flex direction="column" align="center" gap="2" mt="6">
                  <Link asChild size="2" underline="none">
                    <RouterLink to="/forgot-password">¿Olvidaste tu contraseña?</RouterLink>
                  </Link>
                  <Text size="2" color="gray">
                    ¿No tienes cuenta?{" "}
                    <Link asChild color="indigo" size="2" weight="medium" underline="none">
                      <RouterLink to="/register">Regístrate</RouterLink>
                    </Link>
                  </Text>
                </Flex>
              </Box>
            </Card>
          </Box>

          <Text color="gray" size="1">Universidad Antonio José Camacho · Cali, Colombia</Text>
        </Flex>
      </Container>
    </>
  )
}
