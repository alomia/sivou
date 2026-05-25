import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '../../auth/store/auth.store'
import { Sidebar } from '../components/Sidebar'

export const DashboardLayout = () => {
  const { status } = useAuthStore()

  if (status === 'unauthenticated') {
    return <Navigate to="/auth/login" replace />
  }

  if (status === 'checking') {
    return (
      <div className="loading-screen">
        <div className="loading-dot" />
      </div>
    )
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}