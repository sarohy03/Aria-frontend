import { Link2, Loader2 } from 'lucide-react'

function StatusDot({ connected, partial }) {
  if (connected) {
    return <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
  }
  if (partial) {
    return <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-400" />
  }
  return <span className="h-2 w-2 shrink-0 rounded-full bg-zinc-600" />
}

export default function IntegrationsPanel({
  allConnected,
  partiallyConnected,
  loading,
  connecting,
  notice,
  error,
  onConnect,
  onDismissNotice,
}) {
  return (
    <div className="border-b border-white/10 p-3">
      <div className="mb-2 flex items-center gap-2 px-1">
        <Link2 className="h-3.5 w-3.5 text-zinc-500" />
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Connected apps
        </span>
      </div>

      {notice && (
        <div className="mb-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
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

      {loading ? (
        <p className="px-1 text-xs text-zinc-500">Checking connections…</p>
      ) : (
        <div className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5">
          <div className="flex min-w-0 items-center gap-2">
            <StatusDot connected={allConnected} partial={partiallyConnected} />
            <span className="truncate text-sm text-zinc-300">Gmail &amp; Google Docs</span>
          </div>
          {!allConnected && (
            <button
              type="button"
              onClick={onConnect}
              disabled={connecting}
              className="shrink-0 rounded-md border border-white/10 px-2.5 py-1 text-xs text-zinc-300 transition-colors hover:bg-white/[0.06] disabled:opacity-50"
            >
              {connecting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : partiallyConnected ? (
                'Finish'
              ) : (
                'Connect'
              )}
            </button>
          )}
        </div>
      )}

      {!loading && !allConnected && (
        <p className="mt-2 px-1 text-[11px] leading-relaxed text-zinc-500">
          One Google sign-in connects email and docs for Aria.
        </p>
      )}
    </div>
  )
}
