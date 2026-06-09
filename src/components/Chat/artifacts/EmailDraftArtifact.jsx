import { FileEdit } from 'lucide-react'

export default function EmailDraftArtifact({ to, subject, body }) {
  return (
    <div className="overflow-hidden rounded-xl border border-amber-500/20 bg-zinc-900/80">
      <div className="flex items-center gap-2 border-b border-amber-500/20 bg-amber-500/5 px-4 py-2.5">
        <FileEdit className="h-4 w-4 text-amber-400/80" />
        <span className="text-xs font-medium uppercase tracking-wide text-amber-400/80">
          Draft
        </span>
      </div>
      <div className="space-y-3 px-4 py-3">
        <div className="grid gap-2 text-sm sm:grid-cols-[4rem_1fr]">
          <span className="text-zinc-500">To</span>
          <span className="text-zinc-200">{to}</span>
          <span className="text-zinc-500">Subject</span>
          <span className="font-medium text-white">{subject}</span>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-3">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">{body}</p>
        </div>
      </div>
    </div>
  )
}
