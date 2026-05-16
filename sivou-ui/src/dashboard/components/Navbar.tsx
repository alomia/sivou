import { ExitIcon, LockClosedIcon, PersonIcon } from "@radix-ui/react-icons"
import { Avatar, DropdownMenu, Flex, Heading, Text } from "@radix-ui/themes"

import "./Navbar.css"
import { useAuthStore  } from "../../auth/store/auth.store"
import { useNavigate } from "react-router"

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const fullName = `${user?.firstName} ${user?.lastName}`

  const initials = fullName.split(' ').map(n => n.charAt(0).toUpperCase());
  const fallback = initials.slice(0, 2).join('')

  return (
    <Flex justify="between" py="2" px="5" align="center" style={{
      backgroundColor: "var(--color-panel-solid)"
    }}>
      <Heading style={{
        letterSpacing: 5
      }}>SIVOU</Heading>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          className="trigger"
          style={{
            cursor: "pointer"

          }}>
          <Flex gap="2" >
            <Avatar fallback={fallback} radius="full" />
            <Flex direction="column">
              <Text as="p" size="2" weight="medium">{fullName}</Text>
              <Text as="p" color="gray" size="2" weight="light">Estudiante</Text>
            </Flex>
          </Flex>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content sideOffset={10} variant="soft" >
          <DropdownMenu.Item >
            <PersonIcon />
            Mi perfil
          </DropdownMenu.Item>
          <DropdownMenu.Item >
            <LockClosedIcon />
            Cambiar contrasena
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item color="red" onClick={() => {
            logout();
            navigate('/auth/login')
          }} >
            <ExitIcon />
            Cerrar session
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  )
}
