export type CandidacyStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type CandidacyModality = 'INDIVIDUAL' | 'PLANCHA'
export type SlateRole = 'PRINCIPAL' | 'ALTERNATE_1' | 'ALTERNATE_2'

export interface CandidacyMember {
  userId: string
  fullName: string
  email: string
  roleInSlate: SlateRole
}

export interface Candidacy {
  id: string
  electionId: string
  electionName: string
  modality: CandidacyModality
  status: CandidacyStatus
  rejectReason: string | null
  members: CandidacyMember[]
  photoUrl: string | null
  proposalPdfUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface RegisterCandidacyPayload {
  modality: CandidacyModality
  members: { userId: string; roleInSlate: SlateRole }[]
}

export interface ReviewCandidacyPayload {
  status: 'APPROVED' | 'REJECTED'
  rejectReason?: string
}
