import { useCallback, useEffect, useRef } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import ChatSidebar from './ChatSidebar'

const STICKY_THRESHOLD_PX = 120

export default function ChatLayout({
  sessions,
  activeSessionId,
  messages,
  streaming,
  loadingSessions,
  loadingMessages,
  error,
  userLabel,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onSend,
  onSignOut,
  allConnected,
  partiallyConnected,
  integrationsLoading,
  integrationsConnecting,
  integrationsNotice,
  integrationsError,
  onConnectIntegration,
  onDismissIntegrationsNotice,
}) {
  const scrollRef = useRef(null)
  const stickToBottomRef = useRef(true)
  const scrollRafRef = useRef(null)

  const scrollToBottom = useCallback((behavior = 'auto') => {
    const el = scrollRef.current
    if (!el || !stickToBottomRef.current) return
    el.scrollTo({ top: el.scrollHeight, behavior })
  }, [])

  const scheduleScroll = useCallback(
    (behavior = 'auto') => {
      if (scrollRafRef.current != null) return
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = null
        scrollToBottom(behavior)
      })
    },
    [scrollToBottom],
  )

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    stickToBottomRef.current = distanceFromBottom <= STICKY_THRESHOLD_PX
  }, [])

  useEffect(() => {
    scheduleScroll(streaming ? 'auto' : 'smooth')
  }, [messages, streaming, scheduleScroll])

  useEffect(() => {
    return () => {
      if (scrollRafRef.current != null) {
        cancelAnimationFrame(scrollRafRef.current)
      }
    }
  }, [])

  const handleSend = useCallback(
    (text) => {
      stickToBottomRef.current = true
      onSend(text)
    },
    [onSend],
  )

  return (
    <div className="flex h-screen bg-[#030303] text-zinc-100">
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        loading={loadingSessions}
        onNewChat={onNewChat}
        onSelectSession={onSelectSession}
        onDeleteSession={onDeleteSession}
        onSignOut={onSignOut}
        userLabel={userLabel}
        allConnected={allConnected}
        partiallyConnected={partiallyConnected}
        integrationsLoading={integrationsLoading}
        integrationsConnecting={integrationsConnecting}
        integrationsNotice={integrationsNotice}
        integrationsError={integrationsError}
        onConnectIntegration={onConnectIntegration}
        onDismissIntegrationsNotice={onDismissIntegrationsNotice}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-6"
        >
          <div className="mx-auto max-w-3xl space-y-4">
            {!activeSessionId && messages.length === 0 && !loadingMessages && (
              <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-medium text-white">How can I help?</h1>
                <p className="mt-2 max-w-md text-sm text-zinc-400">
                  Ask Aria anything about your business — start typing below to begin a new chat.
                </p>
              </div>
            )}

            {loadingMessages && (
              <p className="text-center text-sm text-zinc-500">Loading messages...</p>
            )}

            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                artifacts={message.artifacts}
                streaming={message.streaming}
                toolStatus={message.toolStatus}
                error={message.error}
              />
            ))}

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}
          </div>
        </div>

        <ChatInput onSend={handleSend} disabled={streaming} />
      </main>
    </div>
  )
}
