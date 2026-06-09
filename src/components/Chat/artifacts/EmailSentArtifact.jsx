import { CheckCircle2 } from 'lucide-react'

export default function EmailSentArtifact({ to, subject, status = 'Sent successfully' }) {
  return (
    <div className="overflow-hidden rounded-xl border border-emerald-500/25 bg-zinc-900/80">
      <div className="flex items-center gap-2 border-b border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5">
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        <span className="text-xs font-medium uppercase tracking-wide text-emerald-400">
          {status}
        </span>
      </div>
      <div className="space-y-2 px-4 py-3 text-sm">
        <div className="flex gap-2">
          <span className="shrink-0 text-zinc-500">To</span>
          <span className="text-zinc-200">{to}</span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 text-zinc-500">Subject</span>
          <span className="font-medium text-white">{subject}</span>
        </div>
      </div>
    </div>
  )
}
