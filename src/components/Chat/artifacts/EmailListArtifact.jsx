import { Inbox } from 'lucide-react'

export default function EmailListArtifact({ title, emails = [] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900/80">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-2.5">
        <Inbox className="h-4 w-4 text-zinc-400" />
        <span className="text-sm font-medium text-zinc-200">
          {title || `Inbox (${emails.length})`}
        </span>
        <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-xs text-zinc-400">
          {emails.length}
        </span>
      </div>
      <ul className="divide-y divide-white/5">
        {emails.map((email, index) => (
          <li key={`${email.subject}-${index}`} className="px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{email.subject}</p>
                <p className="truncate text-xs text-zinc-400">{email.sender}</p>
              </div>
              {email.date && (
                <span className="shrink-0 text-[11px] text-zinc-500">{email.date}</span>
              )}
            </div>
            {email.summary && (
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">{email.summary}</p>
            )}
          </li>
        ))}
        {emails.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-zinc-500">No emails found.</li>
        )}
      </ul>
    </div>
  )
}
