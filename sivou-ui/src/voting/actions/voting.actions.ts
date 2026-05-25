import { sivouAPI } from '../../auth/api/sivou-api'
import type { Ballot, CastVotePayload, VoteResponse } from '../interfaces/voting.interfaces'

export const getBallotAction = async (electionId: string): Promise<Ballot> => {
  const { data } = await sivouAPI.get<Ballot>(`/elections/${electionId}/ballot`)
  return data
}

export const hasVotedAction = async (
  electionId: string,
  roleName: string
): Promise<boolean> => {
  const { data } = await sivouAPI.get<{ hasVoted: boolean }>(
    `/elections/${electionId}/has-voted`,
    { params: { roleName } }
  )
  return data.hasVoted
}

export const castVoteAction = async (
  electionId: string,
  payload: CastVotePayload
): Promise<VoteResponse> => {
  const { data } = await sivouAPI.post<VoteResponse>(
    `/elections/${electionId}/vote`,
    payload
  )
  return data
}
