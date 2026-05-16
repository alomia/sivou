import { lazy } from "react";

import { createBrowserRouter, Navigate } from "react-router";
import { LoginPage, RegisterPage } from "./auth";
import { DashboardLayout } from "./dashboard/layouts/DashboardLayout";
import { HomePage } from "./dashboard/pages/home/HomePage";

const AuthLayout = lazy(() => import('./auth/layouts/AuthLayout'))

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      }
    ]
  },

  {
    path: '*',
    element: <Navigate to="/" />
  }
])
