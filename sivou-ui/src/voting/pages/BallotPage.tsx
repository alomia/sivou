import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box, Button, Card, Flex, Heading, Text,
  Spinner, Callout, Badge, AlertDialog,
} from '@radix-ui/themes'
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Vote, User, FileText, CheckCircle2 } from 'lucide-react'
import { getBallotAction, hasVotedAction, castVoteAction } from '../actions/voting.actions'
import { useAuthStore } from '../../auth/store/auth.store'
import type { BallotCandidacy } from '../interfaces/voting.interfaces'

interface CandidacyCardProps {
  candidacy: BallotCandidacy
  isSelected: boolean
  onSelect: () => void
}

const CandidacyCard = ({ candidacy, isSelected, onSelect }: CandidacyCardProps) => (
  <Card size="2" onClick={onSelect} style={{
    cursor: 'pointer',
    border: isSelected ? '1.5px solid var(--accent-8)' : '1.5px solid var(--gray-a4)',
    background: isSelected ? 'var(--accent-a2)' : undefined,
    transition: 'border-color 120ms ease, background 120ms ease',
  }}>
    <Flex align="center" gap="4">
      <Flex align="center" justify="center" style={{
        width: 52, height: 52, borderRadius: 'var(--radius-3)',
        background: isSelected ? 'var(--accent-a4)' : 'var(--gray-a3)',
        flexShrink: 0, overflow: 'hidden',
      }}>
        {candidacy.photoUrl
          ? <img src={candidacy.photoUrl} alt={candidacy.principalName}
              style={{ width: 52, height: 52, objectFit: 'cover' }} />
          : <User size={22} color={isSelected ? 'var(--accent-11)' : 'var(--gray-9)'} />}
      </Flex>
      <Box style={{ flex: 1 }}>
        <Flex align="center" gap="2" mb="1">
          <Text size="3" weight="medium">{candidacy.principalName}</Text>
          <Badge variant="outline"
            color={candidacy.modality === 'PLANCHA' ? 'indigo' : 'gray'} size="1">
            {candidacy.modality === 'PLANCHA' ? 'Plancha' : 'Individual'}
          </Badge>
        </Flex>
        {candidacy.proposalPdfUrl && (
          <a href={candidacy.proposalPdfUrl} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <FileText size={12} color="var(--accent-11)" />
            <Text size="1" color="indigo">Ver propuesta</Text>
          </a>
        )}
      </Box>
      <Flex align="center" justify="center" style={{
        width: 22, height: 22, borderRadius: '50%',
        border: isSelected ? '2px solid var(--accent-9)' : '2px solid var(--gray-a6)',
        background: isSelected ? 'var(--accent-9)' : 'transparent',
        flexShrink: 0, transition: 'all 120ms ease',
      }}>
        {isSelected && <Box style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
      </Flex>
    </Flex>
  </Card>
)

const BlankVoteCard = ({ isSelected, onSelect }: { isSelected: boolean; onSelect: () => void }) => (
  <Card size="2" onClick={onSelect} style={{
    cursor: 'pointer',
    border: isSelected ? '1.5px solid var(--gray-8)' : '1.5px solid var(--gray-a4)',
    background: isSelected ? 'var(--gray-a3)' : undefined,
    transition: 'border-color 120ms ease, background 120ms ease',
  }}>
    <Flex align="center" gap="4">
      <Flex align="center" justify="center" style={{
        width: 52, height: 52, borderRadius: 'var(--radius-3)',
        background: 'var(--gray-a3)', flexShrink: 0,
      }}>
        <Vote size={22} color="var(--gray-9)" />
      </Flex>
      <Box style={{ flex: 1 }}>
        <Text size="3" weight="medium" color="gray">Voto en blanco</Text>
        <Text size="1" color="gray" style={{ display: 'block' }}>
          Ejerces tu derecho sin seleccionar candidatura
        </Text>
      </Box>
      <Flex align="center" justify="center" style={{
        width: 22, height: 22, borderRadius: '50%',
        border: isSelected ? '2px solid var(--gray-9)' : '2px solid var(--gray-a6)',
        background: isSelected ? 'var(--gray-9)' : 'transparent',
        flexShrink: 0, transition: 'all 120ms ease',
      }}>
        {isSelected && <Box style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
      </Flex>
    </Flex>
  </Card>
)

export const BallotPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const roleName = user?.roles.find(r => r === 'ROLE_VOTANTE') ?? 'ROLE_VOTANTE'

  const [selected, setSelected]     = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [voteError, setVoteError]   = useState<string | null>(null)

  const { data: ballot, isLoading: loadingBallot } = useQuery({
    queryKey: ['ballot', id],
    queryFn: () => getBallotAction(id!),
    enabled: !!id,
  })

  const { data: hasVoted, isLoading: loadingHasVoted } = useQuery({
    queryKey: ['has-voted', id, roleName],
    queryFn: () => hasVotedAction(id!, roleName),
    enabled: !!id,
  })

  const voteMutation = useMutation({
    mutationFn: () => castVoteAction(id!, {
      roleName,
      candidacyId: selected === 'BLANK' ? null : selected,
      blankVote: selected === 'BLANK',
    }),
    onSuccess: () => {
      // Invalida hasVoted para que se refresque en el detalle también
      queryClient.invalidateQueries({ queryKey: ['has-voted', id, roleName] })
      navigate(`/elections/${id}/vote/confirmed`)
    },
    onError: (err: any) => {
      setVoteError(err?.response?.data?.message ?? 'Error al registrar el voto')
      setConfirmOpen(false)
    },
  })

  if (loadingBallot || loadingHasVoted) {
    return (
      <Flex justify="center" align="center" style={{ height: '60vh' }}>
        <Spinner size="3" />
      </Flex>
    )
  }

  if (hasVoted) {
    return (
      <Box className="page" style={{ maxWidth: 500 }}>
        <Card size="4">
          <Flex direction="column" align="center" gap="4" py="6">
            <Flex align="center" justify="center" style={{
              width: 64, height: 64, borderRadius: 'var(--radius-4)',
              background: 'var(--green-a3)',
            }}>
              <CheckCircle2 size={32} color="var(--green-11)" />
            </Flex>
            <Box style={{ textAlign: 'center' }}>
              <Heading size="5" weight="medium" mb="2">Ya emitiste tu voto</Heading>
              <Text size="2" color="gray">
                Tu participación en esta elección ha sido registrada correctamente.
              </Text>
            </Box>
            <Button asChild variant="soft" color="gray" size="2">
              <Link to={`/elections/${id}`}>Volver a la elección</Link>
            </Button>
          </Flex>
        </Card>
      </Box>
    )
  }

  const selectedName = selected === 'BLANK'
    ? 'voto en blanco'
    : ballot?.candidacies.find(c => c.candidacyId === selected)?.principalName ?? ''

  return (
    <Box className="page" style={{ maxWidth: 720 }}>
      <Flex align="center" gap="3" mb="6">
        <Button asChild variant="ghost" color="gray" size="2">
          <Link to={`/elections/${id}`}><ArrowLeftIcon /></Link>
        </Button>
        <Box>
          <Heading size="6" weight="medium" style={{ letterSpacing: '-0.3px' }}>
            Tarjetón electoral
          </Heading>
          <Text size="2" color="gray">
            {ballot?.electionName} — Selecciona una opción
          </Text>
        </Box>
      </Flex>

      {voteError && (
        <Callout.Root color="red" variant="surface" mb="4">
          <Callout.Icon><ExclamationTriangleIcon /></Callout.Icon>
          <Callout.Text>{voteError}</Callout.Text>
        </Callout.Root>
      )}

      <Callout.Root color="indigo" variant="surface" mb="5">
        <Callout.Icon><Vote size={15} /></Callout.Icon>
        <Callout.Text>
          Selecciona una candidatura o voto en blanco. Una vez confirmado no puede modificarse.
        </Callout.Text>
      </Callout.Root>

      {ballot?.candidacies.length === 0 && (
        <Callout.Root color="amber" variant="surface" mb="4">
          <Callout.Text>
            No hay candidatos aprobados en este momento. Contacta al administrador.
          </Callout.Text>
        </Callout.Root>
      )}

      <Flex direction="column" gap="3" mb="5">
        {ballot?.candidacies.map(candidacy => (
          <CandidacyCard
            key={candidacy.candidacyId}
            candidacy={candidacy}
            isSelected={selected === candidacy.candidacyId}
            onSelect={() => setSelected(candidacy.candidacyId)}
          />
        ))}
        {ballot?.blankVoteEnabled && (
          <BlankVoteCard
            isSelected={selected === 'BLANK'}
            onSelect={() => setSelected('BLANK')}
          />
        )}
      </Flex>

      <Flex justify="end" gap="3">
        <Button asChild variant="soft" color="gray" size="2">
          <Link to={`/elections/${id}`}>Cancelar</Link>
        </Button>
        <AlertDialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialog.Trigger>
            <Button size="2" disabled={!selected} color="green">
              <Vote size={14} />
              Confirmar voto
            </Button>
          </AlertDialog.Trigger>
          <AlertDialog.Content maxWidth="400px">
            <AlertDialog.Title>¿Confirmas tu voto?</AlertDialog.Title>
            <AlertDialog.Description size="2" color="gray">
              Vas a votar por <strong>{selectedName}</strong>. Esta acción es irreversible.
            </AlertDialog.Description>
            <Flex gap="3" justify="end" mt="4">
              <AlertDialog.Cancel>
                <Button variant="soft" color="gray">Cancelar</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button color="green" onClick={() => voteMutation.mutate()}
                  disabled={voteMutation.isPending}>
                  <Spinner loading={voteMutation.isPending} />
                  Sí, confirmar
                </Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </Flex>
    </Box>
  )
}
