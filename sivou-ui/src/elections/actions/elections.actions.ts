import { sivouAPI } from '../../auth/api/sivou-api'
import type { CreateElectionPayload, Election, ElectionStatus } from '../interfaces/election.interfaces'

export const getElectionsAction = async (): Promise<Election[]> => {
  const { data } = await sivouAPI.get<Election[]>('/elections')
  return data
}

export const getElectionByIdAction = async (id: string): Promise<Election> => {
  const { data } = await sivouAPI.get<Election>(`/elections/${id}`)
  return data
}

export const createElectionAction = async (payload: CreateElectionPayload): Promise<Election> => {
  const { data } = await sivouAPI.post<Election>('/elections', payload)
  return data
}

export const updateElectionStatusAction = async (
  id: string,
  status: ElectionStatus
): Promise<Election> => {
  const { data } = await sivouAPI.patch<Election>(`/elections/${id}/status`, { status })
  return data
}
