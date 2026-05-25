import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { Box, Card, Flex, Grid, Heading, Text, Button, Badge, Spinner } from '@radix-ui/themes'
import { Vote, Users, BarChart3, Plus, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '../../../auth/store/auth.store'
import { useHasRole } from '../../../auth/hooks/useHasRole'
import { getElectionsAction } from '../../../elections/actions/elections.actions'
import { ElectionStatusBadge } from '../../../elections/components/ElectionStatusBadge'

export const HomePage = () => {
  const { user } = useAuthStore()
  const canManage = useHasRole('ROLE_ADMIN', 'ROLE_SEC_GRAL')
  const canVote   = useHasRole('ROLE_VOTANTE')
  const isAdmin   = useHasRole('ROLE_ADMIN')

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  const { data: elections = [], isLoading } = useQuery({
    queryKey: ['elections'],
    queryFn: getElectionsAction,
  })

  const openElections    = elections.filter(e => e.status === 'OPEN')
  const finishedElections = elections.filter(e => e.status === 'FINISHED')
  const draftCount       = elections.filter(e => e.status === 'DRAFT').length
  const pendingCount     = elections.filter(e => e.status === 'PUBLISHED').length

  return (
    <Box className="page">
      {/* Header */}
      <Flex className="page-header" align="start">
        <Box>
          <Text size="2" color="gray" mb="1" style={{ display: 'block' }}>{greeting}</Text>
          <Heading size="7" weight="medium" style={{ letterSpacing: '-0.5px' }}>
            {user?.firstName} {user?.lastName}
          </Heading>
          <Flex align="center" gap="2" mt="2">
            {user?.roles.map(role => (
              <Badge key={role} color="indigo" variant="soft" radius="full" size="1">
                {role.replace('ROLE_', '')}
              </Badge>
            ))}
          </Flex>
        </Box>
        {canManage && (
          <Button asChild size="2">
            <Link to="/elections/new"><Plus size={14} />Nueva elección</Link>
          </Button>
        )}
      </Flex>

      {/* Cards rápidas — admin/sec_gral */}
      {canManage && (
        <>
          <Flex gap="3" mb="5" wrap="wrap">
            <Card size="2" style={{ flex: 1, minWidth: 140 }}>
              <Text size="1" color="gray" style={{ display: 'block' }} mb="1">
                Elecciones abiertas
              </Text>
              <Heading size="6" weight="medium" style={{ color: 'var(--green-11)' }}>
                {isLoading ? '—' : openElections.length}
              </Heading>
            </Card>
            <Card size="2" style={{ flex: 1, minWidth: 140 }}>
              <Text size="1" color="gray" style={{ display: 'block' }} mb="1">
                En publicación
              </Text>
              <Heading size="6" weight="medium" style={{ color: 'var(--blue-11)' }}>
                {isLoading ? '—' : pendingCount}
              </Heading>
            </Card>
            <Card size="2" style={{ flex: 1, minWidth: 140 }}>
              <Text size="1" color="gray" style={{ display: 'block' }} mb="1">
                En borrador
              </Text>
              <Heading size="6" weight="medium" style={{ color: 'var(--gray-11)' }}>
                {isLoading ? '—' : draftCount}
              </Heading>
            </Card>
            {isAdmin && (
              <Card asChild size="2" style={{ flex: 1, minWidth: 140, cursor: 'pointer' }}>
                <Link to="/users">
                  <Flex align="center" gap="2" mb="1">
                    <Users size={14} color="var(--purple-11)" />
                    <Text size="1" color="gray">Usuarios</Text>
                  </Flex>
                  <Text size="1" color="indigo" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    Gestionar <ArrowRight size={11} />
                  </Text>
                </Link>
              </Card>
            )}
          </Flex>

          {/* Elecciones abiertas para gestionar */}
          {isLoading ? (
            <Flex justify="center" py="6"><Spinner size="2" /></Flex>
          ) : openElections.length > 0 ? (
            <Box mb="5">
              <Text size="2" weight="medium" mb="3" style={{ display: 'block' }}>
                Votaciones en curso
              </Text>
              <Flex direction="column" gap="2">
                {openElections.map(e => (
                  <Card asChild key={e.id} size="2" style={{ cursor: 'pointer' }}>
                    <Link to={`/elections/${e.id}`}>
                      <Flex align="center" justify="between">
                        <Flex align="center" gap="3">
                          <Flex align="center" justify="center" style={{
                            width: 36, height: 36, borderRadius: 'var(--radius-3)',
                            background: 'var(--green-a3)', flexShrink: 0,
                          }}>
                            <Vote size={16} color="var(--green-11)" />
                          </Flex>
                          <Box>
                            <Text size="2" weight="medium">{e.name}</Text>
                            <Text size="1" color="gray">{e.organPosition}</Text>
                          </Box>
                        </Flex>
                        <Flex align="center" gap="2">
                          <ElectionStatusBadge status={e.status} />
                          <ArrowRight size={14} color="var(--gray-9)" />
                        </Flex>
                      </Flex>
                    </Link>
                  </Card>
                ))}
              </Flex>
            </Box>
          ) : (
            <Card size="2" style={{ maxWidth: 400 }}>
              <Flex direction="column" align="center" gap="2" py="4">
                <Vote size={24} color="var(--gray-9)" />
                <Text size="2" color="gray">No hay votaciones activas en este momento.</Text>
              </Flex>
            </Card>
          )}
        </>
      )}

      {/* Vista votante */}
      {canVote && !canManage && (
        <>
          {isLoading ? (
            <Flex justify="center" py="6"><Spinner size="2" /></Flex>
          ) : openElections.length > 0 ? (
            <Box mb="5">
              <Text size="2" weight="medium" mb="3" style={{ display: 'block' }}>
                Elecciones disponibles para votar
              </Text>
              <Flex direction="column" gap="2">
                {openElections.map(e => (
                  <Card asChild key={e.id} size="2"
                    style={{ cursor: 'pointer', border: '1px solid var(--green-a6)', background: 'var(--green-a2)' }}>
                    <Link to={`/elections/${e.id}/vote`}>
                      <Flex align="center" justify="between">
                        <Flex align="center" gap="3">
                          <Flex align="center" justify="center" style={{
                            width: 40, height: 40, borderRadius: 'var(--radius-3)',
                            background: 'var(--green-a4)', flexShrink: 0,
                          }}>
                            <Vote size={18} color="var(--green-11)" />
                          </Flex>
                          <Box>
                            <Text size="2" weight="medium">{e.name}</Text>
                            <Text size="1" color="gray">
                              {e.organPosition} · Cierra a las {e.endTime}
                            </Text>
                          </Box>
                        </Flex>
                        <Flex align="center" gap="2">
                          <Badge color="green" variant="solid" size="1" radius="full">
                            Votar ahora
                          </Badge>
                          <ArrowRight size={14} color="var(--green-11)" />
                        </Flex>
                      </Flex>
                    </Link>
                  </Card>
                ))}
              </Flex>
            </Box>
          ) : (
            <Card size="3" style={{ maxWidth: 400, textAlign: 'center' }} mb="5">
              <Flex direction="column" align="center" gap="3" py="5">
                <Flex align="center" justify="center" style={{
                  width: 52, height: 52, borderRadius: 'var(--radius-4)',
                  background: 'var(--gray-a3)',
                }}>
                  <Vote size={24} color="var(--gray-10)" />
                </Flex>
                <Box>
                  <Text size="3" weight="medium" mb="1" style={{ display: 'block' }}>
                    Sin elecciones activas
                  </Text>
                  <Text size="2" color="gray">
                    Cuando haya una elección abierta aparecerá aquí.
                  </Text>
                </Box>
              </Flex>
            </Card>
          )}

          {/* Resultados publicados */}
          {finishedElections.length > 0 && (
            <Box>
              <Text size="2" weight="medium" mb="3" style={{ display: 'block' }}>
                Resultados publicados
              </Text>
              <Flex direction="column" gap="2">
                {finishedElections.map(e => (
                  <Card asChild key={e.id} size="2" style={{ cursor: 'pointer' }}>
                    <Link to={`/elections/${e.id}/results`}>
                      <Flex align="center" justify="between">
                        <Flex align="center" gap="3">
                          <Flex align="center" justify="center" style={{
                            width: 36, height: 36, borderRadius: 'var(--radius-3)',
                            background: 'var(--purple-a3)', flexShrink: 0,
                          }}>
                            <CheckCircle2 size={16} color="var(--purple-11)" />
                          </Flex>
                          <Box>
                            <Text size="2" weight="medium">{e.name}</Text>
                            <Text size="1" color="gray">{e.organPosition}</Text>
                          </Box>
                        </Flex>
                        <Flex align="center" gap="2">
                          <Badge color="purple" variant="soft" size="1" radius="full">
                            Ver resultados
                          </Badge>
                          <ArrowRight size={14} color="var(--gray-9)" />
                        </Flex>
                      </Flex>
                    </Link>
                  </Card>
                ))}
              </Flex>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}
