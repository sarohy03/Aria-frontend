import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthUI } from '@/components/ui/auth-ui'
import { useAuth } from '@/hooks/useAuth'
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  linkGoogleToAccount,
  getAuthErrorMessage,
} from '@/services/auth/authService'

export default function AuthPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [isSignIn, setIsSignIn] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [linkState, setLinkState] = useState(null)

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/chat', { replace: true })
    }
  }, [authLoading, user, navigate])

  const clearMessages = () => {
    setError('')
    setInfoMessage('')
  }

  const goChat = () => navigate('/chat', { replace: true })

  const handleToggle = () => {
    setIsSignIn((prev) => !prev)
    clearMessages()
    if (!linkState) {
      setInfoMessage('')
    }
  }

  const handleSignIn = async (event) => {
    event.preventDefault()
    clearMessages()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    try {
      const signedInUser = await signInWithEmail(email, password)

      if (linkState?.pendingCredential) {
        await linkGoogleToAccount(signedInUser, linkState.pendingCredential)
        setLinkState(null)
        setInfoMessage('')
      }

      goChat()
    } catch (err) {
      setError(getAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (event) => {
    event.preventDefault()
    clearMessages()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    try {
      await signUpWithEmail({ name, email, password })
      goChat()
    } catch (err) {
      setError(getAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    clearMessages()
    setLoading(true)

    try {
      const result = await signInWithGoogle()

      if (result.cancelled) {
        return
      }

      if (result.linkRequired) {
        setLinkState({
          email: result.email,
          pendingCredential: result.pendingCredential,
        })
        setIsSignIn(true)
        setInfoMessage(
          'This email already has a password account. Sign in with your password below to link Google to it.',
        )
        return
      }

      goChat()
    } catch (err) {
      setError(getAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030303] text-zinc-400">
        Loading...
      </div>
    )
  }

  return (
    <AuthUI
      isSignIn={isSignIn}
      onToggle={handleToggle}
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      onGoogleSignIn={handleGoogleSignIn}
      loading={loading}
      error={error}
      infoMessage={infoMessage}
      defaultEmail={linkState?.email ?? ''}
    />
  )
}
