
export type RoleName = "ESTUDIANTE" | "PROFESOR" | "EGRESADO" | "ADMINISTRATIVO"

export interface Candidate {
  id: string
  firstName: string
  lastName: string
  faculty: string
  photoUrl: string
  proposal: string
  role: RoleName
}

export interface VoteRequest {
  candidateId: string
}

export interface VoteResponse {
  message: string
}
