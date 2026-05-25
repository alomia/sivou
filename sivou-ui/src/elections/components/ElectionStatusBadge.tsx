import { Badge } from '@radix-ui/themes'
import type { ElectionStatus } from '../interfaces/election.interfaces'

const STATUS_CONFIG: Record<ElectionStatus, {
  label: string
  color: 'gray' | 'blue' | 'green' | 'orange' | 'yellow' | 'purple'
}> = {
  DRAFT:      { label: 'Borrador',    color: 'gray'   },
  PUBLISHED:  { label: 'Publicada',   color: 'blue'   },
  OPEN:       { label: 'Abierta',     color: 'green'  },
  CLOSED:     { label: 'Cerrada',     color: 'orange' },
  REPEATING:  { label: 'A repetir',   color: 'yellow' },
  FINISHED:   { label: 'Finalizada',  color: 'purple' },
}

interface Props {
  status: ElectionStatus
}

export const ElectionStatusBadge = ({ status }: Props) => {
  const config = STATUS_CONFIG[status]
  return (
    <Badge color={config.color} variant="soft" radius="full" size="1">
      {config.label}
    </Badge>
  )
}
