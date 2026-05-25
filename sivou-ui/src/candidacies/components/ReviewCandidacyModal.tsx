import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Button, Dialog, Flex, Text, TextArea, Callout, Spinner
} from '@radix-ui/themes'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { reviewCandidacyAction } from '../actions/candidacies.actions'
import type { Candidacy } from '../interfaces/candidacy.interfaces'

interface Props {
  candidacy: Candidacy
  electionId: string
  open: boolean
  onClose: () => void
  action: 'APPROVED' | 'REJECTED'
}

export const ReviewCandidacyModal = ({
  candidacy, electionId, open, onClose, action
}: Props) => {
  const queryClient = useQueryClient()
  const [rejectReason, setRejectReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  const principal = candidacy.members.find(m => m.roleInSlate === 'PRINCIPAL')

  const mutation = useMutation({
    mutationFn: () => reviewCandidacyAction(electionId, candidacy.id, {
      status: action,
      rejectReason: action === 'REJECTED' ? rejectReason : undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidacies', electionId] })
      onClose()
      setRejectReason('')
      setError(null)
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message ?? 'Error al procesar la candidatura')
    },
  })

  const handleConfirm = () => {
    if (action === 'REJECTED' && !rejectReason.trim()) {
      setError('El motivo de rechazo es obligatorio')
      return
    }
    mutation.mutate()
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content maxWidth="420px">
        <Dialog.Title>
          {action === 'APPROVED' ? 'Aprobar candidatura' : 'Rechazar candidatura'}
        </Dialog.Title>
        <Dialog.Description size="2" color="gray" mb="4">
          {action === 'APPROVED'
            ? `¿Confirmas la aprobación de la candidatura de ${principal?.fullName}?`
            : `¿Rechazar la candidatura de ${principal?.fullName}?`}
        </Dialog.Description>

        {error && (
          <Callout.Root color="red" variant="surface" mb="3">
            <Callout.Icon><ExclamationTriangleIcon /></Callout.Icon>
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}

        {action === 'REJECTED' && (
          <Flex direction="column" gap="1" mb="4">
            <Text size="1" weight="medium" color="gray">
              Motivo de rechazo <Text color="red">*</Text>
            </Text>
            <TextArea
              placeholder="Explica el motivo del rechazo..."
              rows={3}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
            />
          </Flex>
        )}

        <Flex gap="3" justify="end">
          <Button variant="soft" color="gray" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            color={action === 'APPROVED' ? 'green' : 'red'}
            onClick={handleConfirm}
            disabled={mutation.isPending}
          >
            <Spinner loading={mutation.isPending} />
            {action === 'APPROVED' ? 'Aprobar' : 'Rechazar'}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
