import { useAuthStore } from '../store/auth.store'

export const useHasRole = (...roles: string[]): boolean => {
  const { user } = useAuthStore()
  if (!user) return false
  return roles.some(role => user.roles.includes(role))
}
