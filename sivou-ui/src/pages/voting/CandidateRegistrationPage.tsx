import { useState } from "react"
import { registerCandidate } from "../../services/candidate.service"
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Dialog,
  Flex,
  Grid,
  Heading,
  ScrollArea,
  Separator,
  Text,
  TextArea,
  TextField,
  Select,
} from "@radix-ui/themes"

import {
  BackpackIcon,
  ReaderIcon,
  PersonIcon,
  DesktopIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons"

import { toast } from "sonner"
import { usePageTitle } from "../../hooks/usePageTitle"
import type { RoleName } from "../../types/voting.types"

const ROLE_COLOR: Record<RoleName, "indigo" | "jade" | "amber" | "tomato"> = {
  ESTUDIANTE: "indigo",
  PROFESOR: "jade",
  EGRESADO: "amber",
  ADMINISTRATIVO: "tomato",
}

const ROLE_ICON: Record<RoleName, React.ReactNode> = {
  ESTUDIANTE: <BackpackIcon />,
  PROFESOR: <ReaderIcon />,
  EGRESADO: <PersonIcon />,
  ADMINISTRATIVO: <DesktopIcon />,
}

export const CandidateRegistrationPage = () => {
  usePageTitle("Inscripción de candidatura")

  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    faculty: "",
    role: "ESTUDIANTE" as RoleName,
    proposal: "",
    photoUrl: "",
    email: "",
    phone: "",
  })

  const getInitials = () => {
    return `${formData.firstName[0] || ""}${formData.lastName[0] || ""}`.toUpperCase()
  }

  const handleChange = (
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      await registerCandidate(formData)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success("Candidatura registrada correctamente")

      setConfirmOpen(false)

      setFormData({
        firstName: "",
        lastName: "",
        faculty: "",
        role: "ESTUDIANTE",
        proposal: "",
        photoUrl: "",
        email: "",
        phone: "",
      })
    } catch (error) {
      toast.error("Error al registrar candidatura")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size="4">
      <Flex direction="column" gap="6" py="7">

        {/* Encabezado */}
        <Flex direction="column" gap="1">
          <Heading style={{ letterSpacing: 8 }} size="8" weight="bold">
            SIVOU
          </Heading>

          <Text color="gray" weight="light">
            Sistema de Votación Universitario · Registro de candidatura
          </Text>
        </Flex>

        <Separator size="4" />

        <Grid columns={{ initial: "1", md: "2" }} gap="5">

          {/* FORMULARIO */}
          <Card>
            <Flex direction="column" gap="4" p="5">

              <Heading size="5">
                Inscribir candidatura
              </Heading>

              {/* Nombres */}
              <Box>
                <Text size="2" weight="medium">
                  Nombres
                </Text>

                <TextField.Root
                  placeholder="Ingresa tus nombres"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleChange("firstName", e.target.value)
                  }
                />
              </Box>

              {/* Apellidos */}
              <Box>
                <Text size="2" weight="medium">
                  Apellidos
                </Text>

                <TextField.Root
                  placeholder="Ingresa tus apellidos"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleChange("lastName", e.target.value)
                  }
                />
              </Box>

              {/* Correo */}
              <Box>
                <Text size="2" weight="medium">
                  Correo institucional
                </Text>

                <TextField.Root
                  placeholder="correo@admon.uniajc.edu.co"
                  value={formData.email}
                  onChange={(e) =>
                    handleChange("email", e.target.value)
                  }
                />
              </Box>

              {/* Teléfono */}
              <Box>
                <Text size="2" weight="medium">
                  Teléfono
                </Text>

                <TextField.Root
                  placeholder="3001234567"
                  value={formData.phone}
                  onChange={(e) =>
                    handleChange("phone", e.target.value)
                  }
                />
              </Box>

              {/* Facultad */}
              <Box>
                <Text size="2" weight="medium">
                  Facultad / Dependencia
                </Text>

                <TextField.Root
                  placeholder="Ej: Ingeniería de Sistemas"
                  value={formData.faculty}
                  onChange={(e) =>
                    handleChange("faculty", e.target.value)
                  }
                />
              </Box>

              {/* Rol */}
              <Box>
                <Text size="2" weight="medium">
                  Tipo de candidatura
                </Text>

                <Select.Root
                  value={formData.role}
                  onValueChange={(value) =>
                    handleChange("role", value)
                  }
                >
                  <Select.Trigger />
                  <Select.Content>

                    <Select.Item value="ESTUDIANTE">
                      Estudiante
                    </Select.Item>

                    <Select.Item value="PROFESOR">
                      Profesor
                    </Select.Item>

                    <Select.Item value="EGRESADO">
                      Egresado
                    </Select.Item>

                    <Select.Item value="ADMINISTRATIVO">
                      Administrativo
                    </Select.Item>

                  </Select.Content>
                </Select.Root>
              </Box>

              {/* Foto */}
              <Box>
                <Text size="2" weight="medium">
                  URL de la foto
                </Text>

                <TextField.Root
                  placeholder="https://..."
                  value={formData.photoUrl}
                  onChange={(e) =>
                    handleChange("photoUrl", e.target.value)
                  }
                />
              </Box>

              {/* Propuesta */}
              <Box>
                <Text size="2" weight="medium">
                  Propuesta
                </Text>

                <TextArea
                  placeholder="Describe tus propuestas para la comunidad universitaria..."
                  rows={6}
                  value={formData.proposal}
                  onChange={(e) =>
                    handleChange("proposal", e.target.value)
                  }
                />
              </Box>

              {/* Botón */}
              <Button
                size="3"
                color="indigo"
                style={{ cursor: "pointer" }}
                onClick={() => setConfirmOpen(true)}
              >
                Registrar candidatura
              </Button>

            </Flex>
          </Card>

          {/* PREVISUALIZACIÓN */}
          <Card>
            <Flex direction="column" gap="4" p="5">

              <Heading size="5">
                Vista previa
              </Heading>

              <Card>
                <Flex direction="column" gap="3" p="4">

                  {/* Header */}
                  <Flex align="center" gap="3">

                    <Avatar
                      size="5"
                      src={formData.photoUrl || undefined}
                      fallback={getInitials()}
                      color={ROLE_COLOR[formData.role]}
                      radius="full"
                    />

                    <Flex direction="column" gap="1">

                      <Text weight="bold" size="4">
                        {formData.firstName || "Nombre"}{" "}
                        {formData.lastName || "Apellido"}
                      </Text>

                      <Badge
                        color={ROLE_COLOR[formData.role]}
                        variant="soft"
                      >
                        {ROLE_ICON[formData.role]}

                        {formData.role.charAt(0) +
                          formData.role.slice(1).toLowerCase()}
                      </Badge>

                    </Flex>
                  </Flex>

                  {/* Facultad */}
                  <Flex direction="column" gap="1">
                    <Text size="1" color="gray">
                      Facultad / Dependencia
                    </Text>

                    <Text weight="medium">
                      {formData.faculty || "Sin registrar"}
                    </Text>
                  </Flex>

                  <Separator size="4" />

                  {/* Propuesta */}
                  <Flex direction="column" gap="2">

                    <Text size="2" weight="bold">
                      Propuesta
                    </Text>

                    <ScrollArea style={{ maxHeight: 180 }}>
                      <Text size="2">
                        {formData.proposal ||
                          "Aquí aparecerá la propuesta del candidato..."}
                      </Text>
                    </ScrollArea>

                  </Flex>

                  {/* Contacto */}
                  <Separator size="4" />

                  <Flex direction="column" gap="1">

                    <Text size="1" color="gray">
                      Correo
                    </Text>

                    <Text size="2">
                      {formData.email || "Sin correo"}
                    </Text>

                    <Text size="1" color="gray">
                      Teléfono
                    </Text>

                    <Text size="2">
                      {formData.phone || "Sin teléfono"}
                    </Text>

                  </Flex>

                </Flex>
              </Card>

            </Flex>
          </Card>

        </Grid>

        <Text color="gray" size="1" align="center">
          Universidad Antonio José Camacho · Cali, Colombia
        </Text>

      </Flex>

      {/* MODAL */}
      <Dialog.Root
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
      >
        <Dialog.Content maxWidth="450px">

          <Dialog.Title>
            Confirmar inscripción
          </Dialog.Title>

          <Dialog.Description
            size="2"
            color="gray"
            mb="4"
          >
            Verifica que toda la información ingresada sea correcta.
          </Dialog.Description>

          <Card>
            <Flex direction="column" gap="3" p="3">

              <Flex align="center" gap="3">

                <Avatar
                  size="4"
                  src={formData.photoUrl || undefined}
                  fallback={getInitials()}
                  color={ROLE_COLOR[formData.role]}
                  radius="full"
                />

                <Flex direction="column">

                  <Text weight="bold">
                    {formData.firstName} {formData.lastName}
                  </Text>

                  <Text size="1" color="gray">
                    {formData.faculty}
                  </Text>

                </Flex>

              </Flex>

              <Badge
                color={ROLE_COLOR[formData.role]}
                variant="soft"
              >
                {formData.role}
              </Badge>

            </Flex>
          </Card>

          <Flex justify="end" gap="3" mt="5">

            <Dialog.Close>
              <Button
                variant="soft"
                color="gray"
                style={{ cursor: "pointer" }}
              >
                Cancelar
              </Button>
            </Dialog.Close>

            <Button
              color="indigo"
              loading={loading}
              onClick={handleSubmit}
              style={{ cursor: "pointer" }}
            >
              <CheckCircledIcon />
              Confirmar inscripción
            </Button>

          </Flex>

        </Dialog.Content>
      </Dialog.Root>
    </Container>
  )
}