import { FileText, Loader2, Search } from 'lucide-react'

export default function DocSearchArtifact({ title, query, documents, status }) {
  const loading = status === 'loading'
  const docs = documents ?? []

  return (
    <div className="overflow-hidden rounded-xl border border-violet-500/20 bg-zinc-900/80">
      <div className="flex items-center gap-2 border-b border-violet-500/20 bg-violet-500/5 px-4 py-2.5">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
        ) : (
          <Search className="h-4 w-4 text-violet-400" />
        )}
        <span className="text-xs font-medium uppercase tracking-wide text-violet-400">
          {loading ? 'Searching documents…' : 'Document search'}
        </span>
      </div>
      <div className="px-4 py-3">
        {loading ? (
          <div className="space-y-2">
            <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-700" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-white/5 p-2">
                <div className="h-4 w-4 animate-pulse rounded bg-zinc-800" />
                <div className="h-3 flex-1 animate-pulse rounded bg-zinc-800" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-white">
              {title || `${docs.length} result${docs.length !== 1 ? 's' : ''}`}
            </p>
            {query && <p className="mt-1 text-xs text-zinc-500">Query: {query}</p>}
            {docs.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {docs.map((doc, i) => (
                  <li
                    key={doc.document_id || doc.url || i}
                    className="flex items-start gap-2 rounded-lg border border-white/5 bg-black/20 px-3 py-2"
                  >
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-zinc-200">{doc.title}</p>
                      {doc.modified && (
                        <p className="text-xs text-zinc-500">
                          Modified {new Date(doc.modified).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                      {doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-violet-400 hover:text-violet-300"
                        >
                          Open →
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-zinc-400">No documents found.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
