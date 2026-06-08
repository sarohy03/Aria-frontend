import { useNavigate } from 'react-router-dom'
import Landing from '../components/Landing/Landing'

export default function LandingPage() {
  const navigate = useNavigate()

  return <Landing onGetStarted={() => navigate('/auth')} />
}
