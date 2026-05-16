import { sivouAPI } from '../api/sivou-api'
import type { AuthResponse } from '../interfaces/auth.response'

export const meAction = async (): Promise<AuthResponse> => {
  const { data } = await sivouAPI.get<AuthResponse>('/auth/me')
  return data
}
