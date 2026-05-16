import { Navigate, Outlet } from "react-router"
import { Navbar } from "../components/Navbar"
import { useAuthStore } from "../../auth/store/auth.store"

export const DashboardLayout = () => {
  const { status } = useAuthStore()

  if (status === 'unauthenticated') {
    return <Navigate to="/auth/login" replace />
  }

  // Mientras verifica el token no muestra nada (evita flash de contenido)
  if (status === 'checking') {
    return null
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}