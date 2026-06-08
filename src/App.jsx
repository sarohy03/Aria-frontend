import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AuthProvider from '@/components/Auth/AuthProvider'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
