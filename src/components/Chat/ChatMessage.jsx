import { Loader2, Sparkles } from 'lucide-react'
import LiveArtifacts from './artifacts/LiveArtifacts'
import MessageContent from './MessageContent'

function TypingIndicator() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400/80"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )
}

export default function ChatMessage({ role, content, artifacts, streaming, toolStatus, error }) {
  const isUser = role === 'user'
  const hasArtifact =
    (artifacts?.length ?? 0) > 0 ||
    content?.includes('```aria-artifact') ||
    content?.includes('aria-artifact {') ||
    content?.includes('aria-artifact{')

  if (isUser) {
    return (
      <div className="flex justify-end message-in">
        <div className="max-w-[min(85%,32rem)] rounded-2xl rounded-br-md bg-gradient-to-br from-zinc-100 to-zinc-200 px-4 py-3 text-sm leading-relaxed text-zinc-900 shadow-sm">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 message-in">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/15 to-zinc-900 shadow-sm">
        <Sparkles className="h-4 w-4 text-violet-300" />
      </div>

      <div
        className={`min-w-0 flex-1 rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-relaxed ${
          hasArtifact
            ? 'max-w-[min(100%,40rem)] border border-white/[0.08] bg-zinc-900/50 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-sm'
            : error
              ? 'max-w-[min(85%,32rem)] border border-red-500/25 bg-red-500/[0.06]'
              : 'max-w-[min(85%,32rem)] border border-white/[0.08] bg-zinc-900/40 shadow-sm backdrop-blur-sm'
        }`}
      >
        <span className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-violet-300/80">
          Aria
        </span>

        {!content && streaming && !toolStatus && <TypingIndicator />}

        <LiveArtifacts artifacts={artifacts} />
        {content ? (
          <div className={artifacts?.length ? 'mt-3' : undefined}>
            <MessageContent content={content} streaming={streaming} />
          </div>
        ) : null}

        {content && streaming && !toolStatus && (
          <span className="ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-0.5 animate-pulse rounded-full bg-violet-400/70" />
        )}

        {toolStatus && (
          <div
            className={`flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-zinc-400 ${
              content || artifacts?.length ? 'mt-3' : ''
            }`}
          >
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-violet-300" />
            <span>{toolStatus}</span>
          </div>
        )}

        {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
      </div>
    </div>
  )
}
