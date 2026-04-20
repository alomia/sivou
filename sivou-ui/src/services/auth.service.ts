import { api } from "./api"
import type { RegisterRequest, AuthResponse } from "../types/auth.types"

export const registerUser = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data)
  return response.data
}
