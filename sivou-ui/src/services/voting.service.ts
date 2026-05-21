
import { api } from "./api"
import type { Candidate, VoteRequest, VoteResponse } from "../types/voting.types"

export const getCandidates = async (): Promise<Candidate[]> => {
  const response = await api.get<Candidate[]>("/candidates")
  return response.data
}

export const submitVote = async (data: VoteRequest): Promise<VoteResponse> => {
  const response = await api.post<VoteResponse>("/votes", data)
  return response.data
}
