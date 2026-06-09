import { FileText, Loader2 } from 'lucide-react'

export default function DocPreviewArtifact({ title, preview, url, status }) {
  const loading = status === 'loading'

  return (
    <div className="overflow-hidden rounded-xl border border-emerald-500/20 bg-zinc-900/80">
      <div className="flex items-center gap-2 border-b border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
        ) : (
          <FileText className="h-4 w-4 text-emerald-400" />
        )}
        <span className="text-xs font-medium uppercase tracking-wide text-emerald-400">
          {loading ? 'Reading document…' : 'Document preview'}
        </span>
      </div>
      <div className="space-y-2 px-4 py-3">
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-700" />
            <div className="h-3 w-full animate-pulse rounded bg-zinc-800" />
            <div className="h-3 w-full animate-pulse rounded bg-zinc-800" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-zinc-800" />
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-white">{title}</p>
            {preview && (
              <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg border border-white/5 bg-black/30 p-3 font-sans text-sm leading-relaxed text-zinc-300">
                {preview}
              </pre>
            )}
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs text-emerald-400 hover:text-emerald-300"
              >
                Open in Google Docs →
              </a>
            )}
          </>
        )}
      </div>
    </div>
  )
}
