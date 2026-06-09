import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useIntegrations } from '@/hooks/useIntegrations'

export default function OAuthCallbackPage() {
  const navigate = useNavigate()
  const { handleOAuthReturn } = useIntegrations()

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await handleOAuthReturn()
      if (!cancelled) {
        navigate('/chat', { replace: true })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [handleOAuthReturn, navigate])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#030303] text-zinc-400">
      <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
      <p className="text-sm">Finishing Google connection…</p>
    </div>
  )
}
