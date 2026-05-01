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
  error?: string
}


export const FormField = ({ label, placeholder, type = "text", leftSlot, rightSlot, style, error, ...fieldProps }: FormFieldProps) => {
  return (
    <Flex style={style} direction="column" gap="2">
      <Text as="label" weight="medium">{label}</Text>
      <TextField.Root size="3" {...fieldProps} placeholder={placeholder} type={type} color={error ? "red" : undefined}>
        {leftSlot && <TextField.Slot>{leftSlot}</TextField.Slot>}
        {rightSlot && <TextField.Slot side="right" pr="3">{rightSlot}</TextField.Slot>}
      </TextField.Root>
      {error && (
        <Text size="1" color="red" mt="1">{error}</Text>
      )}
    </Flex>
  )
}


