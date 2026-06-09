import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ChatLayout from '@/components/Chat/ChatLayout'
import { useAuth } from '@/hooks/useAuth'
import { useChat } from '@/hooks/useChat'
import { useIntegrations } from '@/hooks/useIntegrations'

export default function ChatPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, signOut } = useAuth()
  const chat = useChat()
  const {
    allConnected,
    partiallyConnected,
    loading: integrationsLoading,
    connecting: integrationsConnecting,
    notice: integrationsNotice,
    error: integrationsError,
    connect,
    clearNotice,
    handleOAuthReturn,
  } = useIntegrations()

  useEffect(() => {
    const connected = searchParams.get('connected')
    if (!connected) return

    handleOAuthReturn()
    navigate('/chat', { replace: true })
  }, [searchParams, handleOAuthReturn, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <ChatLayout
      sessions={chat.sessions}
      activeSessionId={chat.activeSessionId}
      messages={chat.messages}
      streaming={chat.streaming}
      loadingSessions={chat.loadingSessions}
      loadingMessages={chat.loadingMessages}
      error={chat.error}
      userLabel={user?.displayName || user?.email}
      onNewChat={chat.startNewChat}
      onSelectSession={chat.loadSession}
      onDeleteSession={chat.removeSession}
      onSend={chat.sendMessage}
      onSignOut={handleSignOut}
      allConnected={allConnected}
      partiallyConnected={partiallyConnected}
      integrationsLoading={integrationsLoading}
      integrationsConnecting={integrationsConnecting}
      integrationsNotice={integrationsNotice}
      integrationsError={integrationsError}
      onConnectIntegration={connect}
      onDismissIntegrationsNotice={clearNotice}
    />
  )
}
