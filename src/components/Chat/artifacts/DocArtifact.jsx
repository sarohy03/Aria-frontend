import { FileText, Loader2 } from 'lucide-react'

export default function DocArtifact({
  title,
  action,
  summary,
  preview,
  url,
  status,
}) {
  const loading = status === 'loading'
  const body = preview || summary

  return (
    <div className="overflow-hidden rounded-xl border border-blue-500/20 bg-zinc-900/80">
      <div className="flex items-center gap-2 border-b border-blue-500/20 bg-blue-500/5 px-4 py-2.5">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
        ) : (
          <FileText className="h-4 w-4 text-blue-400" />
        )}
        <span className="text-xs font-medium uppercase tracking-wide text-blue-400">
          {loading ? `${action || 'Working on'} document…` : `Google Doc — ${action || 'Updated'}`}
        </span>
      </div>
      <div className="space-y-2 px-4 py-3">
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-700" />
            <div className="h-3 w-full animate-pulse rounded bg-zinc-800" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-zinc-800" />
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-white">{title}</p>
            {body && (
              <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap rounded-lg border border-white/5 bg-black/30 p-3 font-sans text-sm leading-relaxed text-zinc-300">
                {body}
              </pre>
            )}
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs text-blue-400 hover:text-blue-300"
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
