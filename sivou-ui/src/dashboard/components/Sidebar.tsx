import { Link, useLocation, useNavigate } from 'react-router'
import { Avatar, DropdownMenu, Flex, Text } from '@radix-ui/themes'
import {
  LayoutDashboard, Vote, Users, BarChart3,
  LogOut, Settings, User, ChevronRight
} from 'lucide-react'
import { useAuthStore } from '../../auth/store/auth.store'
import { useHasRole } from '../../auth/hooks/useHasRole'

export const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const isAdmin   = useHasRole('ROLE_ADMIN')
  const isSecGral = useHasRole('ROLE_SEC_GRAL')
  const isVotante = useHasRole('ROLE_VOTANTE')
  const canManage = isAdmin || isSecGral

  const fullName = user ? `${user.firstName} ${user.lastName}` : ''
  const initials = fullName.split(' ').map(n => n[0]?.toUpperCase()).slice(0, 2).join('')
  const primaryRole = isAdmin ? 'Administrador'
    : isSecGral ? 'Secretaría General'
    : isVotante ? 'Votante'
    : 'Usuario'

  // Nav items según rol
  const NAV = [
    { label: 'Inicio',         href: '/',           icon: LayoutDashboard, show: true },
    { label: 'Elecciones',     href: '/elections',  icon: Vote,            show: true },
    { label: 'Mis votaciones', href: '/mis-votos',  icon: BarChart3,       show: isVotante && !canManage },
    { label: 'Usuarios',       href: '/users',      icon: Users,           show: isAdmin },
  ].filter(i => i.show)

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  return (
    <aside className="app-sidebar">
      <div className="sidebar-logo">
        <Text size="5" weight="bold" style={{ letterSpacing: '2.5px', color: 'var(--gray-12)' }}>
          SIVOU
        </Text>
      </div>

      <nav className="sidebar-nav">
        <Text size="1" weight="medium" style={{
          display: 'block', color: 'var(--gray-9)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '2px 10px 8px',
        }}>
          Menú
        </Text>

        <Flex direction="column" gap="1">
          {NAV.map(item => {
            const Icon = item.icon
            const isActive = item.href === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.href)
            return (
              <Link key={item.href} to={item.href}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}>
                <Icon size={15} className="nav-icon" />
                <Text size="2" style={{ flex: 1, fontFamily: 'var(--font-sans)' }}>
                  {item.label}
                </Text>
                {isActive && <ChevronRight size={12} style={{ color: 'var(--gray-9)' }} />}
              </Link>
            )
          })}
        </Flex>
      </nav>

      <div className="sidebar-footer">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <button className="sidebar-user-trigger">
              <Avatar size="2" radius="full" fallback={initials} color="indigo" />
              <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
                <Text size="1" weight="medium" style={{
                  color: 'var(--gray-12)', whiteSpace: 'nowrap',
                  overflow: 'hidden', textOverflow: 'ellipsis',
                  fontFamily: 'var(--font-sans)',
                }}>
                  {fullName}
                </Text>
                <Text size="1" style={{
                  color: 'var(--gray-9)', whiteSpace: 'nowrap',
                  overflow: 'hidden', textOverflow: 'ellipsis',
                  fontFamily: 'var(--font-sans)',
                }}>
                  {primaryRole}
                </Text>
              </Flex>
              <ChevronRight size={12} style={{ color: 'var(--gray-8)', flexShrink: 0 }} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content side="top" align="start" sideOffset={8}>
            <DropdownMenu.Item>
              <Flex align="center" gap="2"><User size={14} />Mi perfil</Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Flex align="center" gap="2"><Settings size={14} />Configuración</Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item color="red" onClick={handleLogout}>
              <Flex align="center" gap="2"><LogOut size={14} />Cerrar sesión</Flex>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </aside>
  )
}