import { Link as RouterLink, useNavigate } from "react-router"
import { zodResolver } from "@hookform/resolvers/zod"
import { Box, Button, Card, Container, Flex, Grid, Heading, IconButton, Link, Select, Separator, Text, TextField } from "@radix-ui/themes"
import { usePageTitle } from "../../hooks/usePageTitle"
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons"
import { Controller, useForm } from "react-hook-form"
import { registerSchema, type RegisterFormData } from "../../validations/registerSchema"
import { useState } from "react"
import { toast } from "sonner"
import { registerUser } from "../../services/auth.service"

export const RegisterPage = () => {
  usePageTitle("Registro")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register, handleSubmit, control, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const navigate = useNavigate()

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      })
      toast.success("Cuenta creada exitosamente")
      navigate("/login")
    } catch (error: any) {
      const message = error.response?.data?.error ?? "Error al crear la cuenta"
      toast.error(message)
    }
  }

  return (
    <Container>
      <Flex direction="column" justify="center" align="center" height="100vh" gap="5">
        <Box width="700px">
          <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex direction="column" gap="5" p="5">
                <Heading style={{ letterSpacing: 10 }} weight="bold" size="8" align="center">SIVOU</Heading>
                <Box>
                  <Heading>Crear cuenta</Heading>
                  <Text color="gray" weight="light">Completa el formulario para registrarte</Text>
                </Box>
                <Separator size="4" />

                <Grid columns="2" gap="3">
                  <Flex direction="column">
                    <Text weight="medium" mb="2">Tipo de documento</Text>
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
                    {errors.documentType && (
                      <Text size="1" color="red" mt="1">{errors.documentType.message}</Text>
                    )}
                  </Flex>

                  <Flex direction="column">
                    <Text weight="medium" mb="2">Número de documento</Text>
                    <TextField.Root
                      size="3"
                      placeholder="123456789"
                      inputMode="numeric"
                      color={errors.documentNumber ? "red" : undefined}
                      {...register("documentNumber")}
                    />
                    {errors.documentNumber && (
                      <Text size="1" color="red" mt="1">{errors.documentNumber.message}</Text>
                    )}
                  </Flex>
                </Grid>

                <Grid columns="2" gap="3">
                  <Flex direction="column">
                    <Text weight="medium" mb="2">Nombre</Text>
                    <TextField.Root
                      size="3"
                      placeholder="Ana María"
                      color={errors.firstName ? "red" : undefined}
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <Text size="1" color="red" mt="1">{errors.firstName.message}</Text>
                    )}
                  </Flex>

                  <Flex direction="column">
                    <Text weight="medium" mb="2">Apellido</Text>
                    <TextField.Root
                      size="3"
                      placeholder="Ramírez"
                      color={errors.lastName ? "red" : undefined}
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <Text size="1" color="red" mt="1">{errors.lastName.message}</Text>
                    )}
                  </Flex>
                </Grid>

                <Flex direction="column">
                  <Text weight="medium" mb="2">Correo electrónico</Text>
                  <TextField.Root
                    size="3"
                    placeholder="nombre.apellido@uniajc.edu.co"
                    type="email"
                    color={errors.email ? "red" : undefined}
                    {...register("email")}
                  />
                  {errors.email && (
                    <Text size="1" color="red" mt="1">{errors.email.message}</Text>
                  )}
                </Flex>

                <Grid columns="2" gap="3">
                  <Flex direction="column">
                    <Text weight="medium" mb="2">Contraseña</Text>
                    <TextField.Root
                      size="3"
                      placeholder="Mínimo 8 caracteres"
                      type={showPassword ? "text" : "password"}
                      color={errors.password ? "red" : undefined}
                      {...register("password")}
                    >
                      <TextField.Slot side="right" pr="3">
                        <IconButton type="button" size="2" variant="ghost" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeClosedIcon height="16" width="16" /> : <EyeOpenIcon height="16" width="16" />}
                        </IconButton>
                      </TextField.Slot>
                    </TextField.Root>
                    {errors.password && (
                      <Text size="1" color="red" mt="1">{errors.password.message}</Text>
                    )}
                  </Flex>

                  <Flex direction="column">
                    <Text weight="medium" mb="2">Confirmar contraseña</Text>
                    <TextField.Root
                      size="3"
                      placeholder="Repite tu contraseña"
                      type={showConfirmPassword ? "text" : "password"}
                      color={errors.confirmPassword ? "red" : undefined}
                      {...register("confirmPassword")}
                    >
                      <TextField.Slot side="right" pr="3">
                        <IconButton type="button" size="2" variant="ghost" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <EyeClosedIcon height="16" width="16" /> : <EyeOpenIcon height="16" width="16" />}
                        </IconButton>
                      </TextField.Slot>
                    </TextField.Root>
                    {errors.confirmPassword && (
                      <Text size="1" color="red" mt="1">{errors.confirmPassword.message}</Text>
                    )}
                  </Flex>
                </Grid>

                <Button size="3" type="submit">Registrarse</Button>

                <Text size="2" color="gray" align="center">
                  ¿Ya tienes cuenta?{" "}
                  <Link asChild color="indigo" size="2" weight="medium" underline="none">
                    <RouterLink to="/login">Inicia sesión</RouterLink>
                  </Link>
                </Text>
              </Flex>
            </form>
          </Card>
        </Box>
        <Text color="gray" size="1">Universidad Antonio José Camacho · Cali, Colombia</Text>
      </Flex>
    </Container>
  )
}
