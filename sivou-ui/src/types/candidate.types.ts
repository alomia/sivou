import type { RoleName } from "./voting.types"

export interface CandidateRegistrationRequest {
  firstName: string
  lastName: string
  faculty: string
  role: RoleName
  proposal: string
  photoUrl: string
  email: string
  phone: string
}

export interface CandidateRegistrationResponse {
  message: string
  candidateId: string
}