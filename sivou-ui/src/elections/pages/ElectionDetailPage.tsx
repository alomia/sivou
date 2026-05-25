import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box, Button, Card, Flex, Heading, Text, Badge,
  Separator, Spinner, Table, Callout, AlertDialog,
} from '@radix-ui/themes'
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Calendar, Clock, Users, Vote, CheckCircle, XCircle, BarChart3, Plus, UserPlus } from 'lucide-react'
import { getElectionByIdAction, updateElectionStatusAction } from '../actions/elections.actions'
import { getCandidaciesAction } from '../../candidacies/actions/candidacies.actions'
import {
  consolidateResultsAction,
  publishResultsAction,
} from '../../results/actions/results.actions'
import { ElectionStatusBadge } from '../components/ElectionStatusBadge'
import { CandidacyStatusBadge } from '../../candidacies/components/CandidacyStatusBadge'
import { ReviewCandidacyModal } from '../../candidacies/components/ReviewCandidacyModal'
import { RegisterCandidacyModal } from '../../candidacies/components/RegisterCandidacyModal'
import { useHasRole } from '../../auth/hooks/useHasRole'
import type { ElectionStatus } from '../interfaces/election.interfaces'
import type { Candidacy } from '../../candidacies/interfaces/candidacy.interfaces'
import { useAuthStore } from '../../auth/store/auth.store'

const STATUS_ACTIONS: Partial<Record<ElectionStatus, {
  label: string
  next: ElectionStatus
  color: 'blue' | 'green' | 'orange' | 'purple'
  description: string
}>> = {
  DRAFT: { label: 'Publicar', next: 'PUBLISHED', color: 'blue', description: 'La elección será visible para la comunidad.' },
  PUBLISHED: { label: 'Abrir votación', next: 'OPEN', color: 'green', description: 'Los votantes podrán emitir su voto.' },
  OPEN: { label: 'Cerrar votación', next: 'CLOSED', color: 'orange', description: 'Se cerrará la recepción de votos.' },
}

export const ElectionDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const canManage = useHasRole('ROLE_ADMIN', 'ROLE_SEC_GRAL')
  const canVote = useHasRole('ROLE_VOTANTE')
  const isCandidate = useHasRole('ROLE_CANDIDATO')
  const { user: currentUser } = useAuthStore()

  const [reviewModal, setReviewModal] = useState<{
    candidacy: Candidacy
    action: 'APPROVED' | 'REJECTED'
  } | null>(null)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [confirmStatusOpen, setConfirmStatusOpen] = useState(false)
  const [statusError, setStatusError] = useState<string | null>(null)
  const [resultsError, setResultsError] = useState<string | null>(null)

  // ── Queries ──────────────────────────────────────────────────────
  const { data: election, isLoading: loadingElection } = useQuery({
    queryKey: ['election', id],
    queryFn: () => getElectionByIdAction(id!),
    enabled: !!id,
  })

  const { data: candidacies = [], isLoading: loadingCandidacies } = useQuery({
    queryKey: ['candidacies', id],
    queryFn: () => getCandidaciesAction(id!),
    enabled: !!id,
  })

  // ── Mutations ─────────────────────────────────────────────────────
  const statusMutation = useMutation({
    mutationFn: (next: ElectionStatus) => updateElectionStatusAction(id!, next),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['election', id] })
      queryClient.invalidateQueries({ queryKey: ['elections'] })
      setStatusError(null)
    },
    onError: (err: any) => {
      setStatusError(err?.response?.data?.message ?? 'Error al cambiar el estado')
    },
  })

  const consolidateMutation = useMutation({
    mutationFn: () => consolidateResultsAction(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['election', id] })
      setResultsError(null)
    },
    onError: (err: any) => {
      setResultsError(err?.response?.data?.message ?? 'Error al consolidar')
    },
  })

  const publishMutation = useMutation({
    mutationFn: () => publishResultsAction(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['election', id] })
      navigate(`/elections/${id}/results`)
    },
    onError: (err: any) => {
      setResultsError(err?.response?.data?.message ?? 'Error al publicar')
    },
  })

  // ── Helpers ───────────────────────────────────────────────────────
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'long', year: 'numeric',
    })

  // ── Loading / error states ────────────────────────────────────────
  if (loadingElection) {
    return (
      <Flex justify="center" align="center" style={{ height: '60vh' }}>
        <Spinner size="3" />
      </Flex>
    )
  }

  if (!election) {
    return (
      <Box className="page">
        <Text color="red">Elección no encontrada.</Text>
      </Box>
    )
  }

  const statusAction = STATUS_ACTIONS[election.status]
  const pendingCount = candidacies.filter(c => c.status === 'PENDING').length
  const approvedCount = candidacies.filter(c => c.status === 'APPROVED').length

  // Candidaturas visibles según rol y estado
  // Admin/SecGral ven todas; votantes y candidatos solo ven aprobadas
  const visibleCandidacies = canManage
    ? candidacies
    : candidacies.filter(c => c.status === 'APPROVED')

  // Detectar si el candidato actual ya tiene una candidatura en esta elección
  const alreadyRegistered = candidacies.some(c =>
    c.members.some(m => m.userId === currentUser?.id)
  )
  return (
    <Box className="page">

      {/* ── Header ───────────────────────────────────────────────── */}
      <Flex align="start" gap="3" mb="5">
        <Button asChild variant="ghost" color="gray" size="2" mt="1">
          <Link to="/elections"><ArrowLeftIcon /></Link>
        </Button>

        <Box style={{ flex: 1 }}>
          <Flex align="center" gap="3" mb="1" wrap="wrap">
            <Heading size="6" weight="medium" style={{ letterSpacing: '-0.3px' }}>
              {election.name}
            </Heading>
            <ElectionStatusBadge status={election.status} />
          </Flex>
          {election.description && (
            <Text size="2" color="gray">{election.description}</Text>
          )}
        </Box>

        {/* Acciones de estado — ADMIN / SEC_GRAL */}
        <Flex gap="2" align="center">
          {canManage && statusAction && (
            <AlertDialog.Root open={confirmStatusOpen} onOpenChange={setConfirmStatusOpen}>
              <AlertDialog.Trigger>
                <Button size="2" color={statusAction.color} variant="soft" disabled={statusMutation.isPending}>
                  <Spinner loading={statusMutation.isPending} />
                  {statusAction.label}
                </Button>
              </AlertDialog.Trigger>
              <AlertDialog.Content maxWidth="400px">
                <AlertDialog.Title>{statusAction.label}</AlertDialog.Title>
                <AlertDialog.Description size="2" color="gray">
                  {statusAction.description}
                </AlertDialog.Description>
                <Flex gap="3" justify="end" mt="4">
                  <AlertDialog.Cancel>
                    <Button variant="soft" color="gray">Cancelar</Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action>
                    <Button
                      color={statusAction.color}
                      onClick={() => {
                        statusMutation.mutate(statusAction.next)
                        setConfirmStatusOpen(false)
                      }}
                    >
                      Confirmar
                    </Button>
                  </AlertDialog.Action>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>
          )}

          {/* Consolidar — CLOSED */}
          {canManage && election.status === 'CLOSED' && (
            <Button
              size="2"
              color="orange"
              variant="soft"
              disabled={consolidateMutation.isPending}
              onClick={() => consolidateMutation.mutate()}
            >
              <Spinner loading={consolidateMutation.isPending} />
              Consolidar resultados
            </Button>
          )}

          {/* Publicar — CLOSED o REPEATING */}
          {canManage && (election.status === 'CLOSED' || election.status === 'REPEATING') && (
            <Button
              size="2"
              color="purple"
              variant="soft"
              disabled={publishMutation.isPending}
              onClick={() => publishMutation.mutate()}
            >
              <Spinner loading={publishMutation.isPending} />
              Publicar resultados
            </Button>
          )}

          {/* Ver resultados — FINISHED */}
          {election.status === 'FINISHED' && (
            <Button asChild size="2" variant="soft" color="indigo">
              <Link to={`/elections/${id}/results`}>
                <BarChart3 size={14} />
                Ver resultados
              </Link>
            </Button>
          )}

          {/* Votar — solo VOTANTE en OPEN */}
          {canVote && election.status === 'OPEN' && (
            <Button size="2" color="green" onClick={() => navigate(`/elections/${id}/vote`)}>
              <Vote size={14} />
              Votar
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Errores */}
      {statusError && (
        <Callout.Root color="red" variant="surface" mb="4">
          <Callout.Icon><ExclamationTriangleIcon /></Callout.Icon>
          <Callout.Text>{statusError}</Callout.Text>
        </Callout.Root>
      )}
      {resultsError && (
        <Callout.Root color="red" variant="surface" mb="4">
          <Callout.Icon><ExclamationTriangleIcon /></Callout.Icon>
          <Callout.Text>{resultsError}</Callout.Text>
        </Callout.Root>
      )}

      {/* ── Info general ─────────────────────────────────────────── */}
      <Card size="2" mb="5">
        <Flex gap="5" wrap="wrap" align="center">
          <Flex align="center" gap="2">
            <Calendar size={14} color="var(--gray-9)" />
            <Text size="2" color="gray">
              {formatDate(election.startDate)} — {formatDate(election.endDate)}
            </Text>
          </Flex>
          <Flex align="center" gap="2">
            <Clock size={14} color="var(--gray-9)" />
            <Text size="2" color="gray">
              {election.startTime} — {election.endTime}
            </Text>
          </Flex>
          <Flex align="center" gap="2">
            <Users size={14} color="var(--gray-9)" />
            <Text size="2" color="gray">{election.organPosition}</Text>
          </Flex>
          <Badge variant="outline" color={election.type === 'ESTAMENTARIA' ? 'indigo' : 'cyan'} size="1">
            {election.type === 'ESTAMENTARIA' ? 'Estamentaria' : 'Configurable'}
          </Badge>
          {election.blankVote && (
            <Badge variant="outline" color="gray" size="1">Voto en blanco habilitado</Badge>
          )}
        </Flex>
      </Card>

      {/* ── Candidaturas ─────────────────────────────────────────── */}
      <Box>
        <Flex align="center" justify="between" mb="3">
          <Flex align="center" gap="2">
            <Heading size="4" weight="medium">Candidaturas</Heading>
            {approvedCount > 0 && (
              <Badge color="green" variant="soft" size="1">
                {approvedCount} admitida{approvedCount > 1 ? 's' : ''}
              </Badge>
            )}
            {canManage && pendingCount > 0 && (
              <Badge color="yellow" variant="soft" size="1">
                {pendingCount} pendiente{pendingCount > 1 ? 's' : ''}
              </Badge>
            )}
          </Flex>

          {/* Botón inscribir — ROLE_CANDIDATO en PUBLISHED */}
          {isCandidate && election.status === 'PUBLISHED' && !alreadyRegistered && (
            <Button size="2" variant="soft" onClick={() => setRegisterOpen(true)}>
              <UserPlus size={14} />
              Inscribir candidatura
            </Button>
          )}

          {isCandidate && election.status === 'PUBLISHED' && alreadyRegistered && (
            <Badge color="green" variant="soft" size="2">
              Ya estás inscrito — pendiente de aprobación
            </Badge>
          )}
        </Flex>

        <Separator size="4" mb="3" />

        {loadingCandidacies && (
          <Flex justify="center" py="6"><Spinner size="2" /></Flex>
        )}

        {!loadingCandidacies && visibleCandidacies.length === 0 && (
          <Flex direction="column" align="center" py="8" gap="2">
            <Text size="2" color="gray">
              {canManage
                ? 'No hay candidaturas registradas aún.'
                : 'No hay candidatos admitidos para esta elección.'}
            </Text>
          </Flex>
        )}

        {!loadingCandidacies && visibleCandidacies.length > 0 && (
          <Card size="1">
            <Table.Root variant="ghost">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>
                    <Text size="1" weight="medium" color="gray">Candidato principal</Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    <Text size="1" weight="medium" color="gray">Modalidad</Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    <Text size="1" weight="medium" color="gray">Miembros</Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    <Text size="1" weight="medium" color="gray">Estado</Text>
                  </Table.ColumnHeaderCell>
                  {canManage && (
                    <Table.ColumnHeaderCell>
                      <Text size="1" weight="medium" color="gray">Acciones</Text>
                    </Table.ColumnHeaderCell>
                  )}
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {visibleCandidacies.map(candidacy => {
                  const principal = candidacy.members.find(m => m.roleInSlate === 'PRINCIPAL')
                  return (
                    <Table.Row key={candidacy.id}>
                      <Table.Cell>
                        <Flex direction="column" gap="1">
                          <Text size="2" weight="medium">{principal?.fullName ?? '—'}</Text>
                          <Text size="1" color="gray">{principal?.email}</Text>
                        </Flex>
                      </Table.Cell>

                      <Table.Cell>
                        <Badge
                          variant="outline"
                          color={candidacy.modality === 'PLANCHA' ? 'indigo' : 'gray'}
                          size="1"
                        >
                          {candidacy.modality === 'PLANCHA' ? 'Plancha' : 'Individual'}
                        </Badge>
                      </Table.Cell>

                      <Table.Cell>
                        <Text size="2" color="gray">
                          {candidacy.members.length} miembro{candidacy.members.length > 1 ? 's' : ''}
                        </Text>
                      </Table.Cell>

                      <Table.Cell>
                        <Flex direction="column" gap="1">
                          <CandidacyStatusBadge status={candidacy.status} />
                          {candidacy.status === 'REJECTED' && candidacy.rejectReason && (
                            <Text size="1" color="gray" style={{ maxWidth: 200 }}>
                              {candidacy.rejectReason}
                            </Text>
                          )}
                        </Flex>
                      </Table.Cell>

                      {canManage && (
                        <Table.Cell>
                          {candidacy.status === 'PENDING' && (
                            <Flex gap="2">
                              <Button
                                size="1" variant="soft" color="green"
                                onClick={() => setReviewModal({ candidacy, action: 'APPROVED' })}
                              >
                                <CheckCircle size={12} /> Aprobar
                              </Button>
                              <Button
                                size="1" variant="soft" color="red"
                                onClick={() => setReviewModal({ candidacy, action: 'REJECTED' })}
                              >
                                <XCircle size={12} /> Rechazar
                              </Button>
                            </Flex>
                          )}
                        </Table.Cell>
                      )}
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table.Root>
          </Card>
        )}
      </Box>

      {/* ── Modales ──────────────────────────────────────────────── */}
      {reviewModal && (
        <ReviewCandidacyModal
          candidacy={reviewModal.candidacy}
          electionId={id!}
          open={!!reviewModal}
          onClose={() => setReviewModal(null)}
          action={reviewModal.action}
        />
      )}

      <RegisterCandidacyModal
        electionId={id!}
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />
    </Box>
  )
}
