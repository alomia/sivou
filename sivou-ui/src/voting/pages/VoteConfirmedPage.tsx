import { Link, useParams } from 'react-router'
import { Box, Button, Card, Flex, Heading, Text } from '@radix-ui/themes'
import { CheckCircle2 } from 'lucide-react'

export const VoteConfirmedPage = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <Box className="page" style={{ maxWidth: 480 }}>
      <Card size="4">
        <Flex direction="column" align="center" gap="5" py="6">
          <Flex
            align="center"
            justify="center"
            style={{
              width: 72, height: 72,
              borderRadius: 'var(--radius-4)',
              background: 'var(--green-a3)',
            }}
          >
            <CheckCircle2 size={36} color="var(--green-11)" />
          </Flex>

          <Box style={{ textAlign: 'center' }}>
            <Heading size="6" weight="medium" mb="2" style={{ letterSpacing: '-0.3px' }}>
              Voto registrado
            </Heading>
            <Text size="2" color="gray" style={{ lineHeight: 1.6 }}>
              Tu participación ha sido registrada correctamente.
              El resultado se publicará al cierre oficial del proceso electoral.
            </Text>
          </Box>

          <Flex direction="column" gap="2" style={{ width: '100%' }}>
            <Button asChild size="2" variant="soft" color="gray">
              <Link to={`/elections/${id}`}>
                Volver a la elección
              </Link>
            </Button>
            <Button asChild size="2" variant="ghost" color="gray">
              <Link to="/">
                Ir al inicio
              </Link>
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Box>
  )
}
