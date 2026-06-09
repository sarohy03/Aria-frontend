import { Check, Link2, Loader2 } from 'lucide-react'

function StatusBadge({ connected, partial }) {
  if (connected) {
    return (
      <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
        <Check className="h-3 w-3" />
        Connected
      </span>
    )
  }
  if (partial) {
    return (
      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-400">
        Finishing…
      </span>
    )
  }
  return null
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

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
        {loading ? (
          <p className="text-xs text-zinc-500">Checking connections…</p>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-200">Google account</p>
                <p className="mt-0.5 text-[11px] text-zinc-500">Gmail &amp; Google Docs</p>
              </div>
              <StatusBadge connected={allConnected} partial={partiallyConnected} />
            </div>

            {!allConnected && (
              <button
                type="button"
                onClick={onConnect}
                disabled={connecting}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.08] disabled:opacity-50"
              >
                {connecting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Connecting…
                  </>
                ) : partiallyConnected ? (
                  'Finish connecting'
                ) : (
                  'Connect Google account'
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
