export interface BallotCandidacy {
  candidacyId: string
  modality: string
  principalName: string
  photoUrl: string | null
  proposalPdfUrl: string | null
}

export interface Ballot {
  electionId: string
  electionName: string
  blankVoteEnabled: boolean
  candidacies: BallotCandidacy[]
}

export interface CastVotePayload {
  roleName: string
  candidacyId: string | null
  blankVote: boolean
}

export interface VoteResponse {
  voteId: string
  electionId: string
  roleName: string
  blankVote: boolean
  status: string
  emittedAt: string
  message: string
}
