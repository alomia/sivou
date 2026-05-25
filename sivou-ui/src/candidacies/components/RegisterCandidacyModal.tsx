import { useState } from 'react'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Button, Dialog, Flex, Text, Select,
  Callout, Spinner, Separator, Badge, Card,
  Box,
} from '@radix-ui/themes'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { UserPlus } from 'lucide-react'
import { registerCandidacyAction } from '../actions/candidacies.actions'
import { sivouAPI } from '../../auth/api/sivou-api'
import { useAuthStore } from '../../auth/store/auth.store'
import type { CandidacyModality, SlateRole } from '../interfaces/candidacy.interfaces'

interface Props {
  electionId: string
  open: boolean
  onClose: () => void
}

interface UserOption {
  id: string
  firstName: string
  lastName: string
  email: string
  roles: string[]
}

// Solo el admin puede listar usuarios — los candidatos se postulan a sí mismos
// Si el usuario es ADMIN, puede seleccionar cualquier candidato
// Si el usuario es CANDIDATO, se postula a sí mismo
const getUsersAction = async (): Promise<UserOption[]> => {
  const { data } = await sivouAPI.get('/auth/users')
  return data
}

export const RegisterCandidacyModal = ({ electionId, open, onClose }: Props) => {
  const queryClient = useQueryClient()
  const { user: currentUser } = useAuthStore()

  const isAdmin = currentUser?.roles.includes('ROLE_ADMIN') ||
                  currentUser?.roles.includes('ROLE_SEC_GRAL')

  const [modality, setModality]     = useState<CandidacyModality>('INDIVIDUAL')
  const [principal, setPrincipal]   = useState(isAdmin ? '' : currentUser?.id ?? '')
  const [alternate1, setAlternate1] = useState('')
  const [alternate2, setAlternate2] = useState('')
  const [error, setError]           = useState<string | null>(null)

  // Solo carga usuarios si es admin/sec_gral
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getUsersAction,
    enabled: open && isAdmin,
  })

  const mutation = useMutation({
  mutationFn: () => {
    const members: { userId: string; roleInSlate: SlateRole }[] = [
      { userId: principal, roleInSlate: 'PRINCIPAL' },
    ]
    if (modality === 'PLANCHA') {
      if (alternate1) members.push({ userId: alternate1, roleInSlate: 'ALTERNATE_1' })
      if (alternate2) members.push({ userId: alternate2, roleInSlate: 'ALTERNATE_2' })
    }
    return registerCandidacyAction(electionId, { modality, members })
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['candidacies', electionId] })
    toast.success('Candidatura inscrita', {
      description: 'Tu candidatura fue registrada. El administrador la revisará pronto.',
    })
    handleClose()
  },
  onError: (err: any) => {
    const msg = err?.response?.data?.message ?? 'Error al registrar la candidatura'
    setError(msg)
    toast.error('No se pudo inscribir', { description: msg })
  },
})

  const handleClose = () => {
    setModality('INDIVIDUAL')
    setPrincipal(isAdmin ? '' : currentUser?.id ?? '')
    setAlternate1('')
    setAlternate2('')
    setError(null)
    onClose()
  }

  const handleSubmit = () => {
    setError(null)
    if (!principal) {
      setError('Debes seleccionar el candidato principal')
      return
    }
    if (modality === 'PLANCHA' && (!alternate1 || !alternate2)) {
      setError('Una plancha requiere principal y dos suplentes')
      return
    }
    mutation.mutate()
  }

  // Select de usuario — solo para admin
  const UserSelect = ({
    value,
    onChange,
    label,
    required,
    exclude,
  }: {
    value: string
    onChange: (v: string) => void
    label: string
    required?: boolean
    exclude?: string[]
  }) => (
    <Flex direction="column" gap="1">
      <Text size="1" weight="medium" color="gray">
        {label} {required && <Text color="red">*</Text>}
      </Text>
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger
          placeholder={loadingUsers ? 'Cargando usuarios...' : 'Seleccionar usuario'}
          style={{ width: '100%' }}
        />
        <Select.Content>
          {users
            .filter(u => !exclude?.includes(u.id))
            .map(u => (
              <Select.Item key={u.id} value={u.id}>
                {u.firstName} {u.lastName} — {u.email}
              </Select.Item>
            ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  )

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Content maxWidth="480px">
        <Dialog.Title>Inscribir candidatura</Dialog.Title>
        <Dialog.Description size="2" color="gray" mb="4">
          {isAdmin
            ? 'Selecciona la modalidad y los integrantes de la candidatura.'
            : 'Selecciona la modalidad. Tu perfil será registrado como candidato principal.'}
        </Dialog.Description>

        <Flex direction="column" gap="4">
          {error && (
            <Callout.Root color="red" variant="surface">
              <Callout.Icon><ExclamationTriangleIcon /></Callout.Icon>
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}

          {/* Modalidad */}
          <Flex direction="column" gap="1">
            <Text size="1" weight="medium" color="gray">
              Modalidad <Text color="red">*</Text>
            </Text>
            <Select.Root
              value={modality}
              onValueChange={v => {
                setModality(v as CandidacyModality)
                setAlternate1('')
                setAlternate2('')
              }}
            >
              <Select.Trigger style={{ width: '100%' }} />
              <Select.Content>
                <Select.Item value="INDIVIDUAL">Individual — un solo candidato</Select.Item>
                <Select.Item value="PLANCHA">Plancha — principal + 2 suplentes</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <Separator size="4" />

          {/* Si es candidato normal — se muestra a sí mismo */}
          {!isAdmin && (
            <Card size="2" style={{ background: 'var(--accent-a2)', border: '1px solid var(--accent-a6)' }}>
              <Flex align="center" gap="3">
                <Flex
                  align="center"
                  justify="center"
                  style={{
                    width: 36, height: 36,
                    borderRadius: 'var(--radius-3)',
                    background: 'var(--accent-a4)',
                    flexShrink: 0,
                  }}
                >
                  <UserPlus size={16} color="var(--accent-11)" />
                </Flex>
                <Box>
                  <Text size="2" weight="medium">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </Text>
                  <Text size="1" color="gray" style={{ display: 'block' }}>
                    {currentUser?.email} — Candidato principal
                  </Text>
                </Box>
                <Badge color="indigo" variant="soft" size="1" radius="full" style={{ marginLeft: 'auto' }}>
                  Principal
                </Badge>
              </Flex>
            </Card>
          )}

          {/* Si es admin — selectores de usuario */}
          {isAdmin && (
            <UserSelect
              label="Candidato principal"
              required
              value={principal}
              onChange={setPrincipal}
              exclude={[alternate1, alternate2].filter(Boolean)}
            />
          )}

          {/* Suplentes — solo en plancha */}
          {modality === 'PLANCHA' && isAdmin && (
            <>
              <UserSelect
                label="Suplente 1"
                required
                value={alternate1}
                onChange={setAlternate1}
                exclude={[principal, alternate2].filter(Boolean)}
              />
              <UserSelect
                label="Suplente 2"
                required
                value={alternate2}
                onChange={setAlternate2}
                exclude={[principal, alternate1].filter(Boolean)}
              />
            </>
          )}

          {modality === 'PLANCHA' && !isAdmin && (
            <Callout.Root color="indigo" variant="surface">
              <Callout.Text size="2">
                Para una plancha, el administrador deberá completar los suplentes desde su cuenta.
              </Callout.Text>
            </Callout.Root>
          )}
        </Flex>

        <Flex gap="3" justify="end" mt="5">
          <Button variant="soft" color="gray" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            <Spinner loading={mutation.isPending} />
            Inscribir candidatura
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}