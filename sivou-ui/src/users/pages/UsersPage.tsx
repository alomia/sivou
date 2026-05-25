import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box, Button, Card, Flex, Heading, Text,
  Table, Badge, Spinner, Dialog, Checkbox, Callout,
} from '@radix-ui/themes'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Shield } from 'lucide-react'
import { sivouAPI } from '../../auth/api/sivou-api'

// ── Types ──────────────────────────────────────────────────────────
interface UserItem {
  id: string
  firstName: string
  lastName: string
  email: string
  documentType: string
  documentNumber: string
  active: boolean
  roles: string[]
}

const ALL_ROLES = [
  { value: 'ROLE_ADMIN',    label: 'Administrador'     },
  { value: 'ROLE_SEC_GRAL', label: 'Secretaría General'},
  { value: 'ROLE_COMITE',   label: 'Comité Electoral'  },
  { value: 'ROLE_JURADO',   label: 'Jurado'            },
  { value: 'ROLE_VEEDOR',   label: 'Veedor'            },
  { value: 'ROLE_VOTANTE',  label: 'Votante'           },
  { value: 'ROLE_CANDIDATO','label': 'Candidato'       },
]

const ROLE_COLOR: Record<string, 'red' | 'indigo' | 'orange' | 'yellow' | 'cyan' | 'green' | 'gray'> = {
  ROLE_ADMIN:    'red',
  ROLE_SEC_GRAL: 'indigo',
  ROLE_COMITE:   'orange',
  ROLE_JURADO:   'yellow',
  ROLE_VEEDOR:   'cyan',
  ROLE_VOTANTE:  'green',
  ROLE_CANDIDATO:'gray',
}

// ── Actions ────────────────────────────────────────────────────────
const getUsersAction = async (): Promise<UserItem[]> => {
  const { data } = await sivouAPI.get('/auth/users')
  return data
}

const assignRolesAction = async (userId: string, roles: string[]): Promise<UserItem> => {
  const { data } = await sivouAPI.patch(`/auth/users/${userId}/roles`, { roles })
  return data
}

// ── Modal de roles ─────────────────────────────────────────────────
const AssignRolesModal = ({
  user,
  open,
  onClose,
}: {
  user: UserItem
  open: boolean
  onClose: () => void
}) => {
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState<string[]>(user.roles)
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () => assignRolesAction(user.id, selected),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      onClose()
      setError(null)
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message ?? 'Error al asignar roles')
    },
  })

  const toggle = (role: string) => {
    setSelected(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    )
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content maxWidth="420px">
        <Dialog.Title>Asignar roles</Dialog.Title>
        <Dialog.Description size="2" color="gray" mb="4">
          {user.firstName} {user.lastName} — {user.email}
        </Dialog.Description>

        {error && (
          <Callout.Root color="red" variant="surface" mb="3">
            <Callout.Icon><ExclamationTriangleIcon /></Callout.Icon>
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}

        <Flex direction="column" gap="2" mb="4">
          {ALL_ROLES.map(role => (
            <Flex key={role.value} asChild align="center" gap="3">
              <label style={{ cursor: 'pointer', padding: '6px 0' }}>
                <Checkbox
                  size="2"
                  checked={selected.includes(role.value)}
                  onCheckedChange={() => toggle(role.value)}
                />
                <Box style={{ flex: 1 }}>
                  <Text size="2" weight="medium">{role.label}</Text>
                  <Text size="1" color="gray">{role.value}</Text>
                </Box>
                {selected.includes(role.value) && (
                  <Badge
                    color={ROLE_COLOR[role.value] ?? 'gray'}
                    variant="soft"
                    size="1"
                    radius="full"
                  >
                    Activo
                  </Badge>
                )}
              </label>
            </Flex>
          ))}
        </Flex>

        {selected.length === 0 && (
          <Callout.Root color="amber" variant="surface" mb="3">
            <Callout.Text>El usuario quedará sin roles asignados.</Callout.Text>
          </Callout.Root>
        )}

        <Flex gap="3" justify="end">
          <Button variant="soft" color="gray" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            <Spinner loading={mutation.isPending} />
            Guardar cambios
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}

// ── Página principal ───────────────────────────────────────────────
export const UsersPage = () => {
  const [editUser, setEditUser] = useState<UserItem | null>(null)

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsersAction,
  })

  return (
    <Box className="page">
      <Flex className="page-header" align="start">
        <Box>
          <Heading size="6" weight="medium" style={{ letterSpacing: '-0.3px' }}>
            Usuarios
          </Heading>
          <Text size="2" color="gray" mt="1" style={{ display: 'block' }}>
            Gestiona los usuarios y sus roles en el sistema
          </Text>
        </Box>
      </Flex>

      {isLoading && (
        <Flex justify="center" py="9"><Spinner size="3" /></Flex>
      )}

      {!isLoading && users.length === 0 && (
        <Flex direction="column" align="center" py="9" gap="2">
          <Text size="2" color="gray">No hay usuarios registrados.</Text>
        </Flex>
      )}

      {!isLoading && users.length > 0 && (
        <Card size="1">
          <Table.Root variant="ghost">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>
                  <Text size="1" weight="medium" color="gray">Usuario</Text>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <Text size="1" weight="medium" color="gray">Documento</Text>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <Text size="1" weight="medium" color="gray">Roles</Text>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <Text size="1" weight="medium" color="gray">Estado</Text>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {users.map(user => (
                <Table.Row key={user.id}>
                  <Table.Cell>
                    <Flex direction="column" gap="1">
                      <Text size="2" weight="medium">
                        {user.firstName} {user.lastName}
                      </Text>
                      <Text size="1" color="gray">{user.email}</Text>
                    </Flex>
                  </Table.Cell>

                  <Table.Cell>
                    <Text size="2" color="gray">
                      {user.documentType} {user.documentNumber}
                    </Text>
                  </Table.Cell>

                  <Table.Cell>
                    <Flex gap="1" wrap="wrap">
                      {user.roles.length === 0 ? (
                        <Text size="1" color="gray">Sin roles</Text>
                      ) : (
                        user.roles.map(role => (
                          <Badge
                            key={role}
                            color={ROLE_COLOR[role] ?? 'gray'}
                            variant="soft"
                            size="1"
                            radius="full"
                          >
                            {role.replace('ROLE_', '')}
                          </Badge>
                        ))
                      )}
                    </Flex>
                  </Table.Cell>

                  <Table.Cell>
                    <Badge
                      color={user.active ? 'green' : 'red'}
                      variant="soft"
                      size="1"
                      radius="full"
                    >
                      {user.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell>
                    <Button
                      size="1"
                      variant="ghost"
                      color="gray"
                      onClick={() => setEditUser(user)}
                    >
                      <Shield size={13} />
                      Roles
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>
      )}

      {editUser && (
        <AssignRolesModal
          user={editUser}
          open={!!editUser}
          onClose={() => setEditUser(null)}
        />
      )}
    </Box>
  )
}