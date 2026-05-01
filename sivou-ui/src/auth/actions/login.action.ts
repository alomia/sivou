import { sivouAPI } from '../api/sivou-api'
import type { AuthResponse } from '../interfaces/auth.response'
import type { LoginFormData } from '../schemas/login.schema';

export const loginAction = async (formData: LoginFormData): Promise<AuthResponse> => {
  const { data } = await sivouAPI.post<AuthResponse>('/auth/login', formData)
  return data;
}

