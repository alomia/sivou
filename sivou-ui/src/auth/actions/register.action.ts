import { sivouAPI } from '../api/sivou-api'
import type { AuthResponse } from '../interfaces/auth.response'

import type { RegisterFormData } from '../schemas/register.schema'

export const registerAction = async (formData: RegisterFormData): Promise<AuthResponse> => {
  const { data } = await sivouAPI.post<AuthResponse>('/auth/register', formData)
  return data
}
