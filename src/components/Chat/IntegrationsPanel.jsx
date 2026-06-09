import { Check, FileText, Link2, Loader2, Mail } from 'lucide-react'

const TOOLKIT_META = {
  gmail: { icon: Mail, connectLabel: 'Connect Gmail' },
  googledocs: { icon: FileText, connectLabel: 'Connect Google Docs' },
}

function IntegrationRow({ integration, connecting, onConnect }) {
  const meta = TOOLKIT_META[integration.id] ?? { icon: Link2, connectLabel: 'Connect' }
  const Icon = meta.icon
  const isConnecting = connecting === integration.id

  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-zinc-900/80 text-zinc-400">
            <Icon className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-200">{integration.label}</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              {integration.connected ? 'Ready to use' : 'Not connected'}
            </p>
          </div>
        </div>
        {integration.connected ? (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
            <Check className="h-3 w-3" />
            Connected
          </span>
        ) : null}
      </div>

      {!integration.connected && (
        <button
          type="button"
          onClick={() => onConnect(integration.id)}
          disabled={Boolean(connecting)}
          className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.08] disabled:opacity-50"
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Connecting…
            </>
          ) : (
            meta.connectLabel
          )}
        </button>
      )}
    </div>
  )
}

export default function IntegrationsPanel({
  integrations,
  loading,
  connectingToolkit,
  notice,
  error,
  onConnectToolkit,
  onDismissNotice,
}) {
  return (
    <div className="border-b border-white/[0.06] px-3 pb-3">
      <div className="mb-2 flex items-center gap-2 px-1">
        <Link2 className="h-3.5 w-3.5 text-zinc-500" />
        <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
          Workspace
        </span>
      </div>

      {notice && (
        <div className="mb-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
          <div className="flex items-start justify-between gap-2">
            <span>{notice}</span>
            <button
              type="button"
              onClick={onDismissNotice}
              className="text-emerald-300/70 hover:text-emerald-200"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {error && <p className="mb-2 px-1 text-xs text-red-400">{error}</p>}

      <div className="space-y-2">
        {loading ? (
          <p className="px-1 text-xs text-zinc-500">Checking connections…</p>
        ) : integrations.length === 0 ? (
          <p className="px-1 text-xs text-zinc-500">No integrations configured</p>
        ) : (
          integrations.map((integration) => (
            <IntegrationRow
              key={integration.id}
              integration={integration}
              connecting={connectingToolkit}
              onConnect={onConnectToolkit}
            />
          ))
        )}
      </div>
    </div>
  )
}
