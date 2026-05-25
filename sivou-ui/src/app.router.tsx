import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { LoginPage, RegisterPage } from './auth'
import { DashboardLayout } from './dashboard/layouts/DashboardLayout'
import { HomePage } from './dashboard/pages/home/HomePage'
import { ElectionsPage } from './elections/pages/ElectionsPage'
import { CreateElectionPage } from './elections/pages/CreateElectionPage'
import { ElectionDetailPage } from './elections/pages/ElectionDetailPage'
import { BallotPage } from './voting/pages/BallotPage'
import { VoteConfirmedPage } from './voting/pages/VoteConfirmedPage'
import { ResultsPage } from './results/pages/ResultsPage'
import { UsersPage } from './users/pages/UsersPage'

const AuthLayout = lazy(() => import('./auth/layouts/AuthLayout'))

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true,                          element: <HomePage />           },
      { path: 'elections',                    element: <ElectionsPage />      },
      { path: 'elections/new',                element: <CreateElectionPage /> },
      { path: 'elections/:id',                element: <ElectionDetailPage /> },
      { path: 'elections/:id/vote',           element: <BallotPage />         },
      { path: 'elections/:id/vote/confirmed', element: <VoteConfirmedPage />  },
      { path: 'elections/:id/results',        element: <ResultsPage />        },
      { path: 'users',                        element: <UsersPage />          },
    ],
  },
  {
    path: '/auth',
    element: (
      <Suspense fallback={null}>
        <AuthLayout />
      </Suspense>
    ),
    children: [
      { index: true,        element: <Navigate to="/auth/login" /> },
      { path: 'login',      element: <LoginPage />                 },
      { path: 'register',   element: <RegisterPage />              },
    ],
  },
  { path: '*', element: <Navigate to="/" /> },
])