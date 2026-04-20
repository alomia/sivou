export interface RegisterRequest {
  documentType: string
  documentNumber: string
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  id: string
  firstName: string
  lastName: string
  email: string
}
