import { BrowserRouter, Route, Routes } from "react-router"
import { LoginPage } from "./pages/auth/LoginPage"
import { RegisterPage } from "./pages/auth/RegisterPage"

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route index path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="*" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
