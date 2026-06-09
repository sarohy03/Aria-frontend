import { Mail } from 'lucide-react'

export default function EmailArtifact({ sender, subject, summary, date }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900/80">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-2.5">
        <Mail className="h-4 w-4 text-zinc-400" />
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Email
        </span>
        {date && <span className="ml-auto text-xs text-zinc-500">{date}</span>}
      </div>
      <div className="space-y-2 px-4 py-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">From</p>
          <p className="text-sm text-zinc-200">{sender}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">Subject</p>
          <p className="text-sm font-medium text-white">{subject}</p>
        </div>
        {summary && (
          <div>
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">Summary</p>
            <p className="text-sm leading-relaxed text-zinc-300">{summary}</p>
          </div>
        )}
      </div>
    </div>
  )
}
