import { create } from 'zustand'
import type { AuthResponse } from '../interfaces/auth.response'
import { loginAction } from '../actions/login.action'
import { registerAction } from '../actions/register.action'
import { meAction } from '../actions/me.action'

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated'

type AuthState = {
  user: AuthResponse | null
  token: string | null
  status: AuthStatus

  login: (email: string, password: string) => Promise<boolean>
  register: (formData: import('../schemas/register.schema').RegisterFormData) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  status: 'checking',

  // Verifica si el token en localStorage sigue siendo válido
  // Se llama una vez al iniciar la app
  checkAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ status: 'unauthenticated', user: null, token: null })
      return
    }

    try {
      const data = await meAction()
      set({ status: 'authenticated', user: data, token: data.token })
    } catch {
      localStorage.removeItem('token')
      set({ status: 'unauthenticated', user: null, token: null })
    }
  },

  login: async (email, password) => {
    try {
      const data = await loginAction({ email, password })
      localStorage.setItem('token', data.token)
      set({ status: 'authenticated', user: data, token: data.token })
      return true
    } catch {
      localStorage.removeItem('token')
      set({ status: 'unauthenticated', user: null, token: null })
      return false
    }
  },

  register: async (formData) => {
    try {
      const data = await registerAction(formData)
      localStorage.setItem('token', data.token)
      set({ status: 'authenticated', user: data, token: data.token })
      return true
    } catch {
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ status: 'unauthenticated', user: null, token: null })
  },
}))