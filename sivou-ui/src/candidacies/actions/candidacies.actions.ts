import { sivouAPI } from '../../auth/api/sivou-api'
import type {
  Candidacy,
  RegisterCandidacyPayload,
  ReviewCandidacyPayload,
} from '../interfaces/candidacy.interfaces'

export const getCandidaciesAction = async (
  electionId: string,
  status?: string
): Promise<Candidacy[]> => {
  const params = status ? { status } : {}
  const { data } = await sivouAPI.get<Candidacy[]>(
    `/elections/${electionId}/candidacies`,
    { params }
  )
  return data
}

export const registerCandidacyAction = async (
  electionId: string,
  payload: RegisterCandidacyPayload
): Promise<Candidacy> => {
  const { data } = await sivouAPI.post<Candidacy>(
    `/elections/${electionId}/candidacies`,
    payload
  )
  return data
}

export const reviewCandidacyAction = async (
  electionId: string,
  candidacyId: string,
  payload: ReviewCandidacyPayload
): Promise<Candidacy> => {
  const { data } = await sivouAPI.patch<Candidacy>(
    `/elections/${electionId}/candidacies/${candidacyId}/review`,
    payload
  )
  return data
}

