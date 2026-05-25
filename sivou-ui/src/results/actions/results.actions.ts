import { sivouAPI } from '../../auth/api/sivou-api'

export interface ResultRow {
  candidacyId: string | null
  candidateName: string | null
  roleName: string
  blank: boolean
  voteCount: number
  percentage: number
}

export interface ElectionResults {
  electionId: string
  electionName: string
  electionStatus: string
  publishedAt: string | null
  totalVotes: number
  results: ResultRow[]
}

export const consolidateResultsAction = async (electionId: string): Promise<ElectionResults> => {
  const { data } = await sivouAPI.post<ElectionResults>(
    `/elections/${electionId}/results/consolidate`
  )
  return data
}

export const publishResultsAction = async (electionId: string): Promise<ElectionResults> => {
  const { data } = await sivouAPI.post<ElectionResults>(
    `/elections/${electionId}/results/publish`
  )
  return data
}

export const getResultsAction = async (electionId: string): Promise<ElectionResults> => {
  const { data } = await sivouAPI.get<ElectionResults>(
    `/elections/${electionId}/results`
  )
  return data
}
