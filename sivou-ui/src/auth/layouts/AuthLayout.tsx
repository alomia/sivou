import { Box, Container, Flex, Text } from "@radix-ui/themes"
import { Outlet } from "react-router"

const AuthLayout = () => {
  return (
    <Container>
      <Flex height="100vh" direction="column" align="center" justify="center" py="6">
        <Outlet />
        <Box pt="5">
          <Text as="p" color="gray" size="1" align="center">Universidad Antonio José Camacho · Cali, Colombia</Text>
        </Box>
      </Flex>
    </Container>
  )
}

export default AuthLayout
