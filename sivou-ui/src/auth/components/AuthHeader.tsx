import { Flex, Heading, Text } from "@radix-ui/themes"
type TextAlign = React.ComponentProps<typeof Heading>["align"];


interface AuthHeaderProps {
  title: string
  subtitle?: string
  align?: TextAlign
}

export const AuthHeader = ({ title, subtitle, align }: AuthHeaderProps) => {
  return (
    <Flex direction="column" gap="3">
      <Heading style={{ letterSpacing: 10 }} weight="bold" size="8" align={align} >{title}</Heading>
      <Text as="p" color="gray" weight="light" align={align}>{subtitle}</Text>
    </Flex>
  )
}
