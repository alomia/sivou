
import { BrowserRouter, Route, Routes } from "react-router"
import { LoginPage } from "./pages/auth/LoginPage"
import { RegisterPage } from "./pages/auth/RegisterPage"
import { VotingPage } from "./pages/voting/VotingPage"
import { CandidateRegistrationPage } from "./pages/voting/CandidateRegistrationPage"

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route index path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          <Route path="candidate" element={<CandidateRegistrationPage />} />
          <Route path="voting" element={<VotingPage />} />
          <Route path="*" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
