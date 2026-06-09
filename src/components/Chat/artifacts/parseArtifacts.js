const ARTIFACT_FENCE = /```aria-artifact\s*\n([\s\S]*?)```/g

export function parseMessageParts(content) {
  if (!content) return [{ type: 'markdown', content: '' }]

  const parts = []
  let lastIndex = 0
  let match

  ARTIFACT_FENCE.lastIndex = 0
  while ((match = ARTIFACT_FENCE.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'markdown',
        content: content.slice(lastIndex, match.index).trim(),
      })
    }
    try {
      const data = JSON.parse(match[1].trim())
      parts.push({ type: 'artifact', data })
    } catch {
      parts.push({ type: 'markdown', content: match[0] })
    }
    lastIndex = ARTIFACT_FENCE.lastIndex
  }

  const tail = content.slice(lastIndex)
  if (tail.trim()) {
    parts.push({ type: 'markdown', content: tail })
  }

  return parts.length ? parts : [{ type: 'markdown', content }]
}
