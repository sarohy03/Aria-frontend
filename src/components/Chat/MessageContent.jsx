import ChatArtifact from './artifacts/ChatArtifact'
import { parseMessageParts } from './artifacts/parseArtifacts'
import MarkdownRenderer from './markdown/MarkdownRenderer'
import { prepareStreamMarkdown } from './markdown/prepareStreamMarkdown'

export default function MessageContent({ content, streaming = false }) {
  if (!content?.trim()) return null

  if (streaming) {
    const safe = prepareStreamMarkdown(content)
    if (!safe.trim()) return null
    return <MarkdownRenderer content={safe} />
  }

  const parts = parseMessageParts(content)

  return (
    <div className="space-y-1">
      {parts.map((part, index) => {
        if (part.type === 'artifact') {
          return <ChatArtifact key={`artifact-${index}`} data={part.data} />
        }
        if (!part.content?.trim()) return null
        return (
          <div key={`md-${index}`} className={index > 0 ? 'mt-3' : undefined}>
            <MarkdownRenderer content={part.content} />
          </div>
        )
      })}
    </div>
  )
}
