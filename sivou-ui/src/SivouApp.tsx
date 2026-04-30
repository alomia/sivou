import { RouterProvider } from "react-router"
import { appRouter } from "./app.router"

export const SivouApp = () => {
  return (
    <RouterProvider router={appRouter} />
  )
}
