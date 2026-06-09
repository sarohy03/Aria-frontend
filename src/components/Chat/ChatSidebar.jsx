import { MessageSquarePlus, Trash2 } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import IntegrationsPanel from './IntegrationsPanel'

export default function ChatSidebar({
  sessions,
  activeSessionId,
  loading,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onSignOut,
  userLabel,
  allConnected,
  partiallyConnected,
  integrationsLoading,
  integrationsConnecting,
  integrationsNotice,
  integrationsError,
  onConnectIntegration,
  onDismissIntegrationsNotice,
}) {
  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-white/10 bg-zinc-950/80">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
        <Logo />
      </div>

      <div className="p-3">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-zinc-200 transition-colors hover:bg-white/[0.1]"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New chat
        </button>
      </div>

      <IntegrationsPanel
        allConnected={allConnected}
        partiallyConnected={partiallyConnected}
        loading={integrationsLoading}
        connecting={integrationsConnecting}
        notice={integrationsNotice}
        error={integrationsError}
        onConnect={onConnectIntegration}
        onDismissNotice={onDismissIntegrationsNotice}
      />

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {loading ? (
          <p className="px-3 py-2 text-xs text-zinc-500">Loading chats...</p>
        ) : sessions.length === 0 ? (
          <p className="px-3 py-2 text-xs text-zinc-500">No chats yet</p>
        ) : (
          <ul className="space-y-1">
            {sessions.map((session) => {
              const active = session.id === activeSessionId
              return (
                <li key={session.id} className="group flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onSelectSession(session.id)}
                    className={`min-w-0 flex-1 truncate rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      active
                        ? 'bg-white/10 text-white'
                        : 'text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200'
                    }`}
                    title={session.title}
                  >
                    {session.title || 'New chat'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteSession(session.id)}
                    className="rounded-lg p-2 text-zinc-500 opacity-0 transition-opacity hover:bg-white/[0.06] hover:text-red-400 group-hover:opacity-100"
                    aria-label="Delete chat"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-white/10 p-4">
        {userLabel && (
          <p className="mb-2 truncate text-xs text-zinc-500">{userLabel}</p>
        )}
        <button
          type="button"
          onClick={onSignOut}
          className="text-sm text-zinc-400 transition-colors hover:text-white"
        >
          Log out
        </button>
      </div>
    </aside>
  )
}
