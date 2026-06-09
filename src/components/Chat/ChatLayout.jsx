import { useCallback, useEffect, useRef } from 'react'
import ChatEmptyState from './ChatEmptyState'
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

  const showEmpty = !activeSessionId && messages.length === 0 && !loadingMessages

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#030303] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-violet-600/[0.07] blur-[100px]" />
        <div className="absolute -right-24 bottom-0 h-[24rem] w-[24rem] rounded-full bg-blue-600/[0.05] blur-[100px]" />
      </div>

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

      <main className="relative flex min-w-0 flex-1 flex-col">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 pb-36 pt-6"
        >
          <div className="mx-auto max-w-3xl space-y-6">
            {showEmpty && <ChatEmptyState onSuggestion={handleSend} />}

            {loadingMessages && (
              <div className="flex justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-400" />
              </div>
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
