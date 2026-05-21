import { api } from "./api"
import type {
  CandidateRegistrationRequest,
  CandidateRegistrationResponse,
} from "../types/candidate.types"

export const registerCandidate = async (
  data: CandidateRegistrationRequest
): Promise<CandidateRegistrationResponse> => {

  const response = await api.post<CandidateRegistrationResponse>(
    "/candidates/register",
    data
  )

  return response.data
}