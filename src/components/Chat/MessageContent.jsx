import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ChatArtifact from './artifacts/ChatArtifact'
import { parseMessageParts } from './artifacts/parseArtifacts'

export default function MessageContent({ content, streaming = false }) {
  if (streaming) {
    return <p className="whitespace-pre-wrap">{content}</p>
  }

  const parts = parseMessageParts(content)

  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        if (part.type === 'artifact') {
          return <ChatArtifact key={`artifact-${index}`} data={part.data} />
        }
        if (!part.content?.trim()) return null
        return (
          <div
            key={`md-${index}`}
            className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-pre:my-2 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/10 prose-code:text-zinc-200 prose-code:before:content-none prose-code:after:content-none"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{part.content}</ReactMarkdown>
          </div>
        )
      })}
    </div>
  )
}
