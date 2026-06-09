import { LogOut, MessageSquarePlus, Trash2 } from 'lucide-react'
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
  integrations,
  integrationsLoading,
  connectingToolkit,
  integrationsNotice,
  integrationsError,
  onConnectToolkit,
  onDismissIntegrationsNotice,
}) {
  return (
    <aside className="relative z-10 flex w-72 shrink-0 flex-col border-r border-white/[0.06] bg-zinc-950/60 backdrop-blur-xl">
      <div className="border-b border-white/[0.06] px-4 py-4">
        <Logo />
      </div>

      <div className="p-3">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-medium text-zinc-900 shadow-sm transition-all hover:bg-zinc-100"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New chat
        </button>
      </div>

      <IntegrationsPanel
        integrations={integrations}
        loading={integrationsLoading}
        connectingToolkit={connectingToolkit}
        notice={integrationsNotice}
        error={integrationsError}
        onConnectToolkit={onConnectToolkit}
        onDismissNotice={onDismissIntegrationsNotice}
      />

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <p className="mb-1.5 px-3 pt-1 text-[10px] font-medium uppercase tracking-widest text-zinc-600">
          Recent
        </p>
        {loading ? (
          <p className="px-3 py-2 text-xs text-zinc-500">Loading chats…</p>
        ) : sessions.length === 0 ? (
          <p className="px-3 py-2 text-xs text-zinc-500">No chats yet</p>
        ) : (
          <ul className="space-y-0.5">
            {sessions.map((session) => {
              const active = session.id === activeSessionId
              return (
                <li key={session.id} className="group flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => onSelectSession(session.id)}
                    className={`min-w-0 flex-1 truncate rounded-lg px-3 py-2.5 text-left text-sm transition-all ${
                      active
                        ? 'bg-white/[0.08] font-medium text-white shadow-sm'
                        : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                    }`}
                    title={session.title}
                  >
                    {session.title || 'New chat'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteSession(session.id)}
                    className="rounded-lg p-2 text-zinc-600 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
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

      <div className="border-t border-white/[0.06] p-4">
        {userLabel && (
          <p className="mb-3 truncate text-xs font-medium text-zinc-400">{userLabel}</p>
        )}
        <button
          type="button"
          onClick={onSignOut}
          className="flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-200"
        >
          <LogOut className="h-3.5 w-3.5" />
          Log out
        </button>
      </div>
    </aside>
  )
}
