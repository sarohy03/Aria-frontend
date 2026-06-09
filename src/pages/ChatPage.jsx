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
    integrations,
    loading: integrationsLoading,
    connectingToolkit,
    notice: integrationsNotice,
    error: integrationsError,
    connectToolkit,
    clearNotice,
  } = useIntegrations()

  // Legacy Composio callbacks may still land on /chat
  useEffect(() => {
    if (
      searchParams.get('connected') === 'composio' ||
      searchParams.has('connected_account_id')
    ) {
      navigate(`/oauth/callback?${searchParams.toString()}`, { replace: true })
    }
  }, [searchParams, navigate])

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
      integrations={integrations}
      integrationsLoading={integrationsLoading}
      connectingToolkit={connectingToolkit}
      integrationsNotice={integrationsNotice}
      integrationsError={integrationsError}
      onConnectToolkit={connectToolkit}
      onDismissIntegrationsNotice={clearNotice}
    />
  )
}
