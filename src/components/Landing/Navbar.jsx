import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Logo from '../ui/Logo'
import Button from '../ui/Button'

export default function Navbar({ onGetStarted }) {
  const navigate = useNavigate()
  const { user, signOut, loading } = useAuth()

  const handleAuthAction = () => {
    if (user) {
      signOut()
      return
    }
    if (onGetStarted) {
      onGetStarted()
    } else {
      navigate('/auth')
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#030303]/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-6">
          <a
            href="#features"
            className="hidden text-sm text-zinc-300 transition-colors hover:text-white sm:inline"
          >
            Features
          </a>
          {!loading && user && (
            <span className="hidden text-sm text-zinc-400 sm:inline">
              {user.displayName || user.email}
            </span>
          )}
          <Button
            variant="secondary"
            className="px-5 py-2.5 text-sm"
            onClick={handleAuthAction}
            disabled={loading}
          >
            {loading ? '...' : user ? 'Log out' : 'Get Started'}
          </Button>
        </div>
      </nav>
    </header>
  )
}
