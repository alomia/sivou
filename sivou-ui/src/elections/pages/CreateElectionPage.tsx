import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box, Button, Card, Flex, Heading, Text,
  TextField, TextArea, Select, Checkbox,
  Separator, Callout, Spinner,
} from '@radix-ui/themes'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { ArrowLeft } from 'lucide-react'
import { createElectionAction } from '../actions/elections.actions'
import {
  createElectionSchema,
  type CreateElectionFormData,
} from '../schemas/election.schema'

const ROLES = [
  { value: 'ROLE_VOTANTE',   label: 'Votante'           },
  { value: 'ROLE_ESTUDIANTE', label: 'Estudiante'        },
  { value: 'ROLE_DOCENTE',   label: 'Docente'           },
  { value: 'ROLE_EGRESADO',  label: 'Egresado'          },
  { value: 'ROLE_ADMIN',     label: 'Administrador'     },
]

// Componente reutilizable para label + error de campo
const FieldWrapper = ({
  label,
  error,
  required,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) => (
  <Flex direction="column" gap="1">
    <Text size="1" weight="medium" color="gray">
      {label} {required && <Text color="red">*</Text>}
    </Text>
    {children}
    {error && (
      <Text size="1" color="red">{error}</Text>
    )}
  </Flex>
)

export const CreateElectionPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateElectionFormData>({
    resolver: zodResolver(createElectionSchema),
    defaultValues: {
      blankVote: true,
      allowedRoles: [],
    },
  })

  const selectedRoles = watch('allowedRoles') ?? []

  const mutation = useMutation({
    mutationFn: createElectionAction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['elections'] })
      navigate(`/elections/${data.id}`)
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message
      setServerError(msg ?? 'Error al crear la elección. Intenta de nuevo.')
    },
  })

  const onSubmit = (data: CreateElectionFormData) => {
    setServerError(null)
    mutation.mutate(data)
  }

  return (
    <Box className="page" style={{ maxWidth: 680 }}>
      {/* Header */}
      <Flex align="center" gap="3" mb="6">
        <Button asChild variant="ghost" color="gray" size="2">
          <Link to="/elections">
            <ArrowLeft size={15} />
          </Link>
        </Button>
        <Box>
          <Heading size="6" weight="medium" style={{ letterSpacing: '-0.3px' }}>
            Nueva elección
          </Heading>
          <Text size="2" color="gray">
            Configura el proceso electoral para la institución
          </Text>
        </Box>
      </Flex>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" gap="5">

          {serverError && (
            <Callout.Root color="red" variant="surface">
              <Callout.Icon>
                <ExclamationTriangleIcon />
              </Callout.Icon>
              <Callout.Text>{serverError}</Callout.Text>
            </Callout.Root>
          )}

          {/* Sección 1 — Información general */}
          <Card size="3">
            <Flex direction="column" gap="4">
              <Text size="2" weight="medium" color="gray">
                Información general
              </Text>
              <Separator size="4" />

              <FieldWrapper label="Nombre de la elección" error={errors.name?.message} required>
                <TextField.Root
                  placeholder="Ej: Elección Consejo Académico 2026"
                  size="2"
                  {...register('name')}
                  color={errors.name ? 'red' : undefined}
                />
              </FieldWrapper>

              <FieldWrapper label="Descripción" error={errors.description?.message}>
                <TextArea
                  placeholder="Describe brevemente el propósito de esta elección..."
                  rows={3}
                  {...register('description')}
                />
              </FieldWrapper>

              <Flex gap="4">
                <Box style={{ flex: 1 }}>
                  <FieldWrapper label="Tipo" error={errors.type?.message} required>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select.Root
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <Select.Trigger
                            placeholder="Selecciona un tipo"
                            style={{ width: '100%' }}
                            color={errors.type ? 'red' : undefined}
                          />
                          <Select.Content>
                            <Select.Item value="ESTAMENTARIA">Estamentaria</Select.Item>
                            <Select.Item value="CONFIGURABLE">Configurable</Select.Item>
                          </Select.Content>
                        </Select.Root>
                      )}
                    />
                  </FieldWrapper>
                </Box>

                <Box style={{ flex: 1 }}>
                  <FieldWrapper label="Órgano / Cargo" error={errors.organPosition?.message} required>
                    <TextField.Root
                      placeholder="Ej: Consejo Directivo"
                      size="2"
                      {...register('organPosition')}
                      color={errors.organPosition ? 'red' : undefined}
                    />
                  </FieldWrapper>
                </Box>
              </Flex>
            </Flex>
          </Card>

          {/* Sección 2 — Fechas y horarios */}
          <Card size="3">
            <Flex direction="column" gap="4">
              <Text size="2" weight="medium" color="gray">
                Fechas y horarios
              </Text>
              <Separator size="4" />

              <Flex gap="4">
                <Box style={{ flex: 1 }}>
                  <FieldWrapper label="Fecha de inicio" error={errors.startDate?.message} required>
                    <TextField.Root
                      type="date"
                      size="2"
                      {...register('startDate')}
                      color={errors.startDate ? 'red' : undefined}
                    />
                  </FieldWrapper>
                </Box>
                <Box style={{ flex: 1 }}>
                  <FieldWrapper label="Fecha de fin" error={errors.endDate?.message} required>
                    <TextField.Root
                      type="date"
                      size="2"
                      {...register('endDate')}
                      color={errors.endDate ? 'red' : undefined}
                    />
                  </FieldWrapper>
                </Box>
              </Flex>

              <Flex gap="4">
                <Box style={{ flex: 1 }}>
                  <FieldWrapper label="Hora de inicio" error={errors.startTime?.message} required>
                    <TextField.Root
                      type="time"
                      size="2"
                      {...register('startTime')}
                      color={errors.startTime ? 'red' : undefined}
                    />
                  </FieldWrapper>
                </Box>
                <Box style={{ flex: 1 }}>
                  <FieldWrapper label="Hora de cierre" error={errors.endTime?.message} required>
                    <TextField.Root
                      type="time"
                      size="2"
                      {...register('endTime')}
                      color={errors.endTime ? 'red' : undefined}
                    />
                  </FieldWrapper>
                </Box>
              </Flex>
            </Flex>
          </Card>

          {/* Sección 3 — Configuración de votación */}
          <Card size="3">
            <Flex direction="column" gap="4">
              <Text size="2" weight="medium" color="gray">
                Configuración de votación
              </Text>
              <Separator size="4" />

              <FieldWrapper
                label="Roles habilitados para votar"
                error={errors.allowedRoles?.message}
                required
              >
                <Controller
                  name="allowedRoles"
                  control={control}
                  render={({ field }) => (
                    <Flex direction="column" gap="2" mt="1">
                      {ROLES.map(role => (
                        <Flex key={role.value} align="center" gap="2" asChild>
                          <label style={{ cursor: 'pointer' }}>
                            <Checkbox
                              size="2"
                              checked={field.value?.includes(role.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...(field.value ?? []), role.value])
                                } else {
                                  field.onChange(
                                    field.value?.filter(r => r !== role.value) ?? []
                                  )
                                }
                              }}
                            />
                            <Text size="2">{role.label}</Text>
                          </label>
                        </Flex>
                      ))}
                    </Flex>
                  )}
                />
                {selectedRoles.length > 0 && (
                  <Text size="1" color="gray" mt="1">
                    {selectedRoles.length} rol{selectedRoles.length > 1 ? 'es' : ''} seleccionado{selectedRoles.length > 1 ? 's' : ''}
                  </Text>
                )}
              </FieldWrapper>

              <Separator size="4" />

              <Controller
                name="blankVote"
                control={control}
                render={({ field }) => (
                  <Flex align="center" justify="between">
                    <Flex direction="column" gap="1">
                      <Text size="2" weight="medium">Voto en blanco</Text>
                      <Text size="1" color="gray">
                        Obligatorio por el Acuerdo 004/2021 — siempre habilitado
                      </Text>
                    </Flex>
                    <Checkbox
                      size="2"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled
                    />
                  </Flex>
                )}
              />
            </Flex>
          </Card>

          {/* Acciones */}
          <Flex justify="end" gap="3">
            <Button asChild variant="soft" color="gray" size="2">
              <Link to="/elections">Cancelar</Link>
            </Button>
            <Button
              type="submit"
              size="2"
              disabled={mutation.isPending}
            >
              <Spinner loading={mutation.isPending} />
              Crear elección
            </Button>
          </Flex>

        </Flex>
      </form>
    </Box>
  )
}