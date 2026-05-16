import { Box, Button, Flex } from "@radix-ui/themes"

const navigation = [
  {
    title: "inicio"
  },
  {
    title: "Elecciones activas"
  },
  {
    title: "Mi perfil"
  },
]



export const Sidebar = () => {
  return (
    <Box style={{ borderRight: "1px solid #eee", height: "100vh", padding: "16px" }}>
      <Flex direction="column" gap="2">
        {navigation.map((item) => (
          <Button key={item.title} variant="ghost" style={{ justifyContent: "flex-start" }}>
            {item.title}
          </Button>
        ))}
      </Flex>
    </Box>
  )
}
