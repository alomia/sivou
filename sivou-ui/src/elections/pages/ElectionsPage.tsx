import { useState } from 'react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import {
  Box, Button, Flex, Heading, Text, Table,
  Badge, Spinner, Card, Select,
} from '@radix-ui/themes'
import { Plus, Vote, Calendar, ArrowRight } from 'lucide-react'
import { getElectionsAction } from '../actions/elections.actions'
import { ElectionStatusBadge } from '../components/ElectionStatusBadge'
import { useHasRole } from '../../auth/hooks/useHasRole'
import type { ElectionStatus } from '../interfaces/election.interfaces'

// Estados que puede ver un votante
const VOTER_VISIBLE: ElectionStatus[] = ['PUBLISHED', 'OPEN', 'CLOSED', 'FINISHED']

const STATUS_FILTERS: { label: string; value: ElectionStatus | 'ALL' }[] = [
  { label: 'Todas',      value: 'ALL'       },
  { label: 'Publicada',  value: 'PUBLISHED' },
  { label: 'Abierta',    value: 'OPEN'      },
  { label: 'Cerrada',    value: 'CLOSED'    },
  { label: 'A repetir',  value: 'REPEATING' },
  { label: 'Finalizada', value: 'FINISHED'  },
]

const MANAGE_FILTERS: { label: string; value: ElectionStatus | 'ALL' }[] = [
  { label: 'Todas',      value: 'ALL'       },
  { label: 'Borrador',   value: 'DRAFT'     },
  ...STATUS_FILTERS.slice(1),
]

export const ElectionsPage = () => {
  const canManage = useHasRole('ROLE_ADMIN', 'ROLE_SEC_GRAL')
  const [statusFilter, setStatusFilter] = useState<ElectionStatus | 'ALL'>('ALL')

  const { data: allElections = [], isLoading, isError } = useQuery({
    queryKey: ['elections'],
    queryFn: getElectionsAction,
  })

  // Votantes solo ven elecciones relevantes
  const elections = canManage
    ? allElections
    : allElections.filter(e => VOTER_VISIBLE.includes(e.status))

  const filtered = statusFilter === 'ALL'
    ? elections
    : elections.filter(e => e.status === statusFilter)

  const filters = canManage ? MANAGE_FILTERS : STATUS_FILTERS

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric'
    })

  return (
    <Box className="page">
      <Flex className="page-header" align="start">
        <Box>
          <Heading size="6" weight="medium" style={{ letterSpacing: '-0.3px' }}>
            Elecciones
          </Heading>
          <Text size="2" color="gray" mt="1" style={{ display: 'block' }}>
            {canManage
              ? 'Gestiona los procesos electorales de la institución'
              : 'Elecciones disponibles para tu participación'}
          </Text>
        </Box>
        {canManage && (
          <Button asChild size="2">
            <Link to="/elections/new">
              <Plus size={14} />
              Nueva elección
            </Link>
          </Button>
        )}
      </Flex>

      <Flex align="center" gap="3" mb="4">
        <Text size="2" color="gray">Filtrar:</Text>
        <Select.Root
          value={statusFilter}
          onValueChange={v => setStatusFilter(v as ElectionStatus | 'ALL')}
        >
          <Select.Trigger variant="soft" />
          <Select.Content>
            {filters.map(f => (
              <Select.Item key={f.value} value={f.value}>{f.label}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        {elections.length > 0 && (
          <Text size="1" color="gray">
            {filtered.length} de {elections.length}
          </Text>
        )}
      </Flex>

      {isLoading && <Flex justify="center" py="9"><Spinner size="3" /></Flex>}

      {isError && (
        <Card size="2"><Text size="2" color="red">
          No se pudieron cargar las elecciones.
        </Text></Card>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <Flex direction="column" align="center" py="9" gap="3">
          <Flex align="center" justify="center" style={{
            width: 56, height: 56, borderRadius: 'var(--radius-4)',
            background: 'var(--gray-a3)',
          }}>
            <Vote size={26} color="var(--gray-9)" />
          </Flex>
          <Box style={{ textAlign: 'center' }}>
            <Text size="3" weight="medium" mb="1" style={{ display: 'block' }}>
              {statusFilter === 'ALL'
                ? 'No hay elecciones disponibles'
                : `Sin elecciones "${filters.find(f => f.value === statusFilter)?.label}"`}
            </Text>
            <Text size="2" color="gray">
              {canManage ? 'Crea la primera elección.' : 'Vuelve más tarde.'}
            </Text>
          </Box>
          {canManage && (
            <Button asChild size="2" variant="soft" mt="2">
              <Link to="/elections/new"><Plus size={14} />Crear elección</Link>
            </Button>
          )}
        </Flex>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <Card size="1">
          <Table.Root variant="ghost">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>
                  <Text size="1" weight="medium" color="gray">Nombre</Text>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <Text size="1" weight="medium" color="gray">Tipo</Text>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <Text size="1" weight="medium" color="gray">Órgano / Cargo</Text>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <Text size="1" weight="medium" color="gray">Fechas</Text>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <Text size="1" weight="medium" color="gray">Estado</Text>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filtered.map(election => (
                <Table.Row key={election.id} style={{ cursor: 'pointer' }}>
                  <Table.Cell>
                    <Flex direction="column" gap="1">
                      <Text size="2" weight="medium">{election.name}</Text>
                      {election.description && (
                        <Text size="1" color="gray" style={{
                          maxWidth: 260, whiteSpace: 'nowrap',
                          overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {election.description}
                        </Text>
                      )}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="outline"
                      color={election.type === 'ESTAMENTARIA' ? 'indigo' : 'cyan'} size="1">
                      {election.type === 'ESTAMENTARIA' ? 'Estamentaria' : 'Configurable'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" color="gray">{election.organPosition}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="1">
                      <Calendar size={12} color="var(--gray-9)" />
                      <Text size="1" color="gray">
                        {formatDate(election.startDate)} — {formatDate(election.endDate)}
                      </Text>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <ElectionStatusBadge status={election.status} />
                  </Table.Cell>
                  <Table.Cell>
                    <Button asChild size="1" variant="ghost" color="gray">
                      <Link to={`/elections/${election.id}`}>
                        <ArrowRight size={13} />
                      </Link>
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>
      )}
    </Box>
  )
}