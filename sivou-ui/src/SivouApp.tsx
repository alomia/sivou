import { useEffect } from "react"
import { RouterProvider } from "react-router"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from 'sonner'

import { appRouter } from "./app.router"
import { useAuthStore } from "./auth/store/auth.store"

const queryClient = new QueryClient()

const AppWithAuth = () => {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <>
      <RouterProvider router={appRouter} />
      <Toaster
        position="bottom-right"
        theme="dark"
        richColors
        closeButton
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

export const SivouApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppWithAuth />
    </QueryClientProvider>
  )
}