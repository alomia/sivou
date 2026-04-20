import { Toaster } from "sonner"
import { AppRouter } from "./AppRouter"

export const SivouApp = () => {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <AppRouter />
    </>
  )
}
