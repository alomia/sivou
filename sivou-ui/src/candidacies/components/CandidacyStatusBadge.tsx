import { Badge } from '@radix-ui/themes'
import type { CandidacyStatus } from '../interfaces/candidacy.interfaces'

const CONFIG: Record<CandidacyStatus, {
  label: string
  color: 'yellow' | 'green' | 'red'
}> = {
  PENDING:  { label: 'Pendiente', color: 'yellow' },
  APPROVED: { label: 'Aprobada',  color: 'green'  },
  REJECTED: { label: 'Rechazada', color: 'red'    },
}

export const CandidacyStatusBadge = ({ status }: { status: CandidacyStatus }) => {
  const config = CONFIG[status]
  return (
    <Badge color={config.color} variant="soft" radius="full" size="1">
      {config.label}
    </Badge>
  )
}
