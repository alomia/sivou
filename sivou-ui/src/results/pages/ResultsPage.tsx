import { useParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import {
  Box, Button, Card, Flex, Heading, Text,
  Spinner, Badge, Separator,
} from '@radix-ui/themes'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { Trophy, Vote } from 'lucide-react'
import { getResultsAction } from '../actions/results.actions'
import type { ResultRow } from '../actions/results.actions'

// Barra de porcentaje
const PercentBar = ({ value, isWinner }: { value: number; isWinner: boolean }) => (
  <Box style={{ width: '100%' }}>
    <Box
      style={{
        height: 6,
        borderRadius: 999,
        background: 'var(--gray-a4)',
        overflow: 'hidden',
      }}
    >
      <Box
        style={{
          height: '100%',
          width: `${value}%`,
          borderRadius: 999,
          background: isWinner ? 'var(--green-9)' : 'var(--accent-9)',
          transition: 'width 600ms ease',
        }}
      />
    </Box>
  </Box>
)

export const ResultsPage = () => {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['results', id],
    queryFn: () => getResultsAction(id!),
    enabled: !!id,
  })

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ height: '60vh' }}>
        <Spinner size="3" />
      </Flex>
    )
  }

  if (isError || !data) {
    return (
      <Box className="page" style={{ maxWidth: 500 }}>
        <Card size="3">
          <Flex direction="column" align="center" gap="3" py="6">
            <Text size="3" weight="medium">Resultados no disponibles</Text>
            <Text size="2" color="gray" style={{ textAlign: 'center' }}>
              Los resultados aún no han sido publicados o no existen para esta elección.
            </Text>
            <Button asChild variant="soft" color="gray" size="2">
              <Link to={`/elections/${id}`}>Volver a la elección</Link>
            </Button>
          </Flex>
        </Card>
      </Box>
    )
  }

  // Determinar ganador (mayor voteCount, excluyendo blancos)
  const nonBlank = data.results.filter(r => !r.blank)
  const maxVotes = Math.max(...nonBlank.map(r => r.voteCount), 0)
  const blankRow = data.results.find(r => r.blank)
  const blankPercentage = blankRow?.percentage ?? 0
  const isRepeating = blankPercentage >= 51

  const isWinner = (row: ResultRow) =>
    !row.blank && row.voteCount === maxVotes && maxVotes > 0

  return (
    <Box className="page" style={{ maxWidth: 740 }}>
      {/* Header */}
      <Flex align="center" gap="3" mb="6">
        <Button asChild variant="ghost" color="gray" size="2">
          <Link to={`/elections/${id}`}><ArrowLeftIcon /></Link>
        </Button>
        <Box>
          <Heading size="6" weight="medium" style={{ letterSpacing: '-0.3px' }}>
            Resultados oficiales
          </Heading>
          <Text size="2" color="gray">{data.electionName}</Text>
        </Box>
      </Flex>

      {/* Alerta voto en blanco >= 51% */}
      {isRepeating && (
        <Card size="2" mb="4" style={{ border: '1px solid var(--amber-a6)', background: 'var(--amber-a2)' }}>
          <Flex align="center" gap="3">
            <Vote size={18} color="var(--amber-11)" />
            <Box>
              <Text size="2" weight="medium" style={{ color: 'var(--amber-11)', display: 'block' }}>
                Elección a repetir
              </Text>
              <Text size="1" color="gray">
                El voto en blanco superó el 51% de los votos válidos. El proceso debe repetirse con candidatos diferentes.
              </Text>
            </Box>
          </Flex>
        </Card>
      )}

      {/* Resumen */}
      <Flex gap="3" mb="5" wrap="wrap">
        <Card size="2" style={{ flex: 1, minWidth: 140 }}>
          <Text size="1" color="gray" style={{ display: 'block' }} mb="1">Total de votos</Text>
          <Heading size="6" weight="medium">{data.totalVotes}</Heading>
        </Card>
        <Card size="2" style={{ flex: 1, minWidth: 140 }}>
          <Text size="1" color="gray" style={{ display: 'block' }} mb="1">Candidaturas</Text>
          <Heading size="6" weight="medium">{nonBlank.length}</Heading>
        </Card>
        {data.publishedAt && (
          <Card size="2" style={{ flex: 2, minWidth: 200 }}>
            <Text size="1" color="gray" style={{ display: 'block' }} mb="1">Publicado</Text>
            <Text size="2" weight="medium">{formatDate(data.publishedAt)}</Text>
          </Card>
        )}
      </Flex>

      {/* Tabla de resultados */}
      <Card size="2">
        <Heading size="3" weight="medium" mb="4">Conteo de votos</Heading>
        <Separator size="4" mb="4" />

        <Flex direction="column" gap="4">
          {data.results
            .slice()
            .sort((a, b) => b.voteCount - a.voteCount)
            .map((row, index) => {
              const winner = isWinner(row)
              return (
                <Box key={row.candidacyId ?? 'blank'}>
                  <Flex align="center" gap="3" mb="2">
                    {/* Posición o icono */}
                    <Flex
                      align="center"
                      justify="center"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--radius-3)',
                        background: winner
                          ? 'var(--green-a3)'
                          : row.blank
                          ? 'var(--gray-a3)'
                          : 'var(--gray-a3)',
                        flexShrink: 0,
                      }}
                    >
                      {winner ? (
                        <Trophy size={15} color="var(--green-11)" />
                      ) : row.blank ? (
                        <Vote size={15} color="var(--gray-9)" />
                      ) : (
                        <Text size="1" weight="bold" color="gray">
                          {index + 1}
                        </Text>
                      )}
                    </Flex>

                    {/* Nombre */}
                    <Box style={{ flex: 1 }}>
                      <Flex align="center" gap="2">
                        <Text size="2" weight={winner ? 'bold' : 'medium'}>
                          {row.blank ? 'Voto en blanco' : (row.candidateName ?? '—')}
                        </Text>
                        {winner && (
                          <Badge color="green" variant="soft" size="1" radius="full">
                            Ganador
                          </Badge>
                        )}
                        {row.blank && (
                          <Badge color="gray" variant="outline" size="1" radius="full">
                            En blanco
                          </Badge>
                        )}
                      </Flex>
                    </Box>

                    {/* Votos y porcentaje */}
                    <Flex align="center" gap="3">
                      <Text size="2" color="gray">
                        {row.voteCount} voto{row.voteCount !== 1 ? 's' : ''}
                      </Text>
                      <Text
                        size="2"
                        weight="medium"
                        style={{ minWidth: 48, textAlign: 'right' }}
                      >
                        {row.percentage}%
                      </Text>
                    </Flex>
                  </Flex>

                  {/* Barra */}
                  <Box style={{ paddingLeft: 44 }}>
                    <PercentBar value={row.percentage} isWinner={winner} />
                  </Box>
                </Box>
              )
            })}
        </Flex>

        <Separator size="4" mt="5" mb="3" />
        <Flex justify="between" align="center">
          <Text size="1" color="gray">Total votos válidos contabilizados</Text>
          <Text size="2" weight="bold">{data.totalVotes}</Text>
        </Flex>
      </Card>
    </Box>
  )
}
