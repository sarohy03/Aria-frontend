import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { warmBackend } from '@/api'
import Landing from '../components/Landing/Landing'

export default function LandingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    warmBackend()
  }, [])

  return <Landing onGetStarted={() => navigate('/auth')} />
}
