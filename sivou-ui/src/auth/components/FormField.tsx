import type { CSSProperties, ReactNode } from "react"
import { Flex, Text, TextField } from "@radix-ui/themes"

type TextFieldType = React.ComponentProps<typeof TextField.Root>["type"]

interface FormFieldProps {
  label: string
  placeholder?: string
  type?: TextFieldType
  leftSlot?: ReactNode
  rightSlot?: ReactNode
  style?: CSSProperties
}


export const FormField = ({ label, placeholder, type = "text", leftSlot, rightSlot, style }: FormFieldProps) => {
  return (
    <Flex style={style} direction="column" gap="2">
      <Text as="label" weight="medium">{label}</Text>
      <TextField.Root size="3" placeholder={placeholder} type={type}>
        {leftSlot && <TextField.Slot>{leftSlot}</TextField.Slot>}
        {rightSlot && <TextField.Slot side="right" pr="3">{rightSlot}</TextField.Slot>}
      </TextField.Root>
    </Flex>
  )
}


