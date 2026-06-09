import { Loader2 } from 'lucide-react'
import LiveArtifacts from './artifacts/LiveArtifacts'
import MessageContent from './MessageContent'

export default function ChatMessage({ role, content, artifacts, streaming, toolStatus, error }) {
  const isUser = role === 'user'
  const hasArtifact =
    (artifacts?.length ?? 0) > 0 ||
    content?.includes('```aria-artifact') ||
    content?.includes('aria-artifact {') ||
    content?.includes('aria-artifact{')

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'max-w-[85%] bg-zinc-800 text-zinc-100'
            : hasArtifact
              ? 'max-w-[min(100%,42rem)] border border-white/10 bg-zinc-800/60 text-zinc-200'
              : error
                ? 'max-w-[85%] border border-red-500/30 bg-red-500/5 text-zinc-200'
                : 'max-w-[85%] border border-white/10 bg-zinc-800/60 text-zinc-200'
        }`}
      >
        {!isUser && (
          <span className="mb-1.5 block text-xs font-medium text-zinc-400">
            Aria
          </span>
        )}
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <>
            {!content && streaming && !toolStatus && (
              <span className="inline-flex gap-1 text-zinc-400">
                <span className="animate-pulse">●</span>
                <span className="animate-pulse [animation-delay:150ms]">●</span>
                <span className="animate-pulse [animation-delay:300ms]">●</span>
              </span>
            )}
            <LiveArtifacts artifacts={artifacts} />
            {content ? (
              <div className={artifacts?.length ? 'mt-3' : undefined}>
                <MessageContent content={content} streaming={streaming} />
              </div>
            ) : null}
            {content && streaming && !toolStatus && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-zinc-400" />
            )}
            {toolStatus && (
              <div
                className={`flex items-center gap-2 text-xs text-zinc-400 ${content ? 'mt-3 border-t border-white/10 pt-3' : ''}`}
              >
                <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-zinc-300" />
                <span>{toolStatus}</span>
              </div>
            )}
            {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
          </>
        )}
      </div>
    </div>
  )
}
