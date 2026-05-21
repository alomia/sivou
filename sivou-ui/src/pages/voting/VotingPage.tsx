import { useEffect, useState } from "react"
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Dialog,
  Flex,
  Grid,
  Heading,
  ScrollArea,
  Separator,
  Text,
} from "@radix-ui/themes"
import {
  PersonIcon,
  ReaderIcon,
  BackpackIcon,
  DesktopIcon,
  StarIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons"
import { toast } from "sonner"
import { usePageTitle } from "../../hooks/usePageTitle"
import { getCandidates, submitVote } from "../../services/voting.service"
import type { Candidate, RoleName } from "../../types/voting.types"


type TabKey = RoleName | "TODOS"

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "TODOS",          label: "Todos",          icon: <StarIcon />       },
  { key: "ESTUDIANTE",     label: "Estudiante",     icon: <BackpackIcon />   },
  { key: "PROFESOR",       label: "Profesor",       icon: <ReaderIcon />     },
  { key: "EGRESADO",       label: "Egresado",       icon: <PersonIcon />     },
  { key: "ADMINISTRATIVO", label: "Administrativo", icon: <DesktopIcon />    },
]

const ROLE_COLOR: Record<RoleName, "indigo" | "jade" | "amber" | "tomato"> = {
  ESTUDIANTE:     "indigo",
  PROFESOR:       "jade",
  EGRESADO:       "amber",
  ADMINISTRATIVO: "tomato",
}

const getInitials = (first: string, last: string) =>
  `${first[0]}${last[0]}`.toUpperCase()

export const VotingPage = () => {
  usePageTitle("Votación")

  const [activeTab, setActiveTab]           = useState<TabKey>("TODOS")
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [confirmOpen, setConfirmOpen]       = useState(false)
  const [loading, setLoading]               = useState(false)
  const [votedRole, setVotedRole]           = useState<Set<RoleName>>(new Set())

  const [candidates, setCandidates] = useState<Candidate[]>([])

  useEffect (() => {
    loadCandidates ()
  }, [])
  const loadCandidates = async () => {
    try {
      const data = await getCandidates()
      setCandidates (data)
    }catch (error){
      toast.error("error al cargar candidatos")
    }
  }
  const visibleCandidates =
    activeTab === "TODOS"
      ? candidates
      : candidates.filter((c) => c.role === activeTab)

  const handleVoteClick = (candidate: Candidate) => {
    if (votedRole.has(candidate.role)) {
      toast.error(`Ya votaste para el rol de ${candidate.role.toLowerCase()}`)
      return
    }
    setSelectedCandidate(candidate)
    setConfirmOpen(true)
  }

  const handleConfirmVote = async () => {
    if (!selectedCandidate) return
    setLoading(true)
    try {
      await submitVote({ candidateId: selectedCandidate.id })
      setVotedRole((prev) => new Set(prev).add(selectedCandidate.role))
      toast.success(`Voto registrado para ${selectedCandidate.firstName} ${selectedCandidate.lastName}`)
      setConfirmOpen(false)
      setSelectedCandidate(null)
    } catch (error: any) {
      const message = error.response?.data?.error ?? "Error al registrar el voto"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size="4">
      <Flex direction="column" gap="6" py="7">

        {/* Encabezado */}
        <Flex direction="column" gap="1">
          <Heading style={{ letterSpacing: 8 }} size="8" weight="bold">
            SIVOU
          </Heading>
          <Text color="gray" weight="light">
            Sistema de Votación Universitario · Selecciona un candidato para votar
          </Text>
        </Flex>

        <Separator size="4" />

        {/* Tabs de roles */}
        <Flex gap="2" wrap="wrap">
          {TABS.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "solid" : "soft"}
              color={activeTab === tab.key ? "indigo" : "gray"}
              style={{ cursor: "pointer" }}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              {tab.label}
              {tab.key !== "TODOS" && votedRole.has(tab.key as RoleName) && (
                <CheckCircledIcon color="var(--green-9)" />
              )}
            </Button>
          ))}
        </Flex>

        {/* Grid de candidatos */}
        {visibleCandidates.length === 0 ? (
          <Flex align="center" justify="center" height="200px">
            <Text color="gray">No hay candidatos inscritos para este rol.</Text>
          </Flex>
        ) : (
          <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="4">
            {visibleCandidates.map((candidate) => {
              const alreadyVoted = votedRole.has(candidate.role)
              return (
                <Card key={candidate.id} style={{ opacity: alreadyVoted ? 0.6 : 1 }}>
                  <Flex direction="column" gap="3" p="4">

                    {/* Cabecera: avatar + nombre + badge */}
                    <Flex align="center" gap="3">
                      <Avatar
                        size="4"
                        src={candidate.photoUrl || undefined}
                        fallback={getInitials(candidate.firstName, candidate.lastName)}
                        color={ROLE_COLOR[candidate.role]}
                        radius="full"
                      />
                      <Flex direction="column" gap="1" style={{ flex: 1, minWidth: 0 }}>
                        <Text weight="bold" style={{ lineHeight: 1.2 }}>
                          {candidate.firstName} {candidate.lastName}
                        </Text>
                        <Badge color={ROLE_COLOR[candidate.role]} variant="soft" size="1">
                          {candidate.role.charAt(0) + candidate.role.slice(1).toLowerCase()}
                        </Badge>
                      </Flex>
                    </Flex>

                    {/* Facultad */}
                    <Flex gap="1" align="center">
                      <Text size="1" color="gray">Facultad:</Text>
                      <Text size="1" weight="medium">{candidate.faculty}</Text>
                    </Flex>

                    <Separator size="4" />

                    {/* Propuesta */}
                    <Flex direction="column" gap="1" style={{ flex: 1 }}>
                      <Text size="1" color="gray" weight="medium">Propuesta</Text>
                      <ScrollArea style={{ maxHeight: 72 }}>
                        <Text size="2">{candidate.proposal}</Text>
                      </ScrollArea>
                    </Flex>

                    {/* Botón votar */}
                    <Button
                      size="2"
                      variant={alreadyVoted ? "soft" : "solid"}
                      color={alreadyVoted ? "green" : "indigo"}
                      style={{ cursor: alreadyVoted ? "default" : "pointer", marginTop: "auto" }}
                      disabled={alreadyVoted}
                      onClick={() => handleVoteClick(candidate)}
                    >
                      {alreadyVoted ? (
                        <><CheckCircledIcon /> Ya votaste en este rol</>
                      ) : (
                        "Votar por este candidato"
                      )}
                    </Button>

                  </Flex>
                </Card>
              )
            })}
          </Grid>
        )}

        <Text color="gray" size="1" align="center">
          Universidad Antonio José Camacho · Cali, Colombia
        </Text>
      </Flex>

      {/* Modal de confirmación */}
      <Dialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
        <Dialog.Content maxWidth="420px">
          <Dialog.Title>Confirmar voto</Dialog.Title>
          <Dialog.Description size="2" color="gray" mb="4">
            Esta acción no se puede deshacer. Solo puedes votar una vez por cada rol.
          </Dialog.Description>

          {selectedCandidate && (
            <Card>
              <Flex align="center" gap="3" p="3">
                <Avatar
                  size="4"
                  src={selectedCandidate.photoUrl || undefined}
                  fallback={getInitials(selectedCandidate.firstName, selectedCandidate.lastName)}
                  color={ROLE_COLOR[selectedCandidate.role]}
                  radius="full"
                />
                <Flex direction="column" gap="1">
                  <Text weight="bold">
                    {selectedCandidate.firstName} {selectedCandidate.lastName}
                  </Text>
                  <Text size="1" color="gray">{selectedCandidate.faculty}</Text>
                  <Badge color={ROLE_COLOR[selectedCandidate.role]} variant="soft" size="1">
                    {selectedCandidate.role.charAt(0) + selectedCandidate.role.slice(1).toLowerCase()}
                  </Badge>
                </Flex>
              </Flex>
            </Card>
          )}

          <Flex gap="3" justify="end" mt="5">
            <Dialog.Close>
              <Button variant="soft" color="gray" style={{ cursor: "pointer" }}>
                Cancelar
              </Button>
            </Dialog.Close>
            <Button
              color="indigo"
              loading={loading}
              style={{ cursor: "pointer" }}
              onClick={handleConfirmVote}
            >
              Confirmar voto
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Container>
  )
}
