import { FileText, Mail, Sparkles } from 'lucide-react'

const SUGGESTIONS = [
  {
    icon: Mail,
    label: 'Summarize today’s emails',
    prompt: 'What emails did I get today? Give me a quick summary.',
  },
  {
    icon: FileText,
    label: 'Find a Google Doc',
    prompt: 'Search my Google Docs for my most recently edited file.',
  },
  {
    icon: Sparkles,
    label: 'Draft something',
    prompt: 'Help me draft a professional follow-up email to a client.',
  },
]

export default function ChatEmptyState({ onSuggestion }) {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 scale-150 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-lg shadow-black/40">
          <Sparkles className="h-6 w-6 text-violet-300" />
        </div>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        How can I help?
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
        Your AI chief of staff for email and Google Docs — ask in plain language.
      </p>

      <div className="mt-8 grid w-full max-w-lg gap-2 sm:grid-cols-1">
        {SUGGESTIONS.map(({ icon: Icon, label, prompt }) => (
          <button
            key={label}
            type="button"
            onClick={() => onSuggestion(prompt)}
            className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-left transition-all hover:border-white/15 hover:bg-white/[0.06]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/80 text-zinc-400 transition-colors group-hover:border-violet-500/30 group-hover:text-violet-300">
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-sm text-zinc-300 group-hover:text-zinc-100">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
