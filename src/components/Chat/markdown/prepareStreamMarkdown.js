/** Prepare assistant markdown for rendering while tokens are still streaming. */
export function prepareStreamMarkdown(content) {
  if (!content) return ''

  let text = stripIncompleteArtifact(content)
  text = closeOpenCodeFence(text)
  return text
}

function stripIncompleteArtifact(content) {
  const fenceIdx = content.indexOf('```aria-artifact')
  if (fenceIdx !== -1) {
    const rest = content.slice(fenceIdx + '```aria-artifact'.length)
    if (!rest.includes('```')) {
      return content.slice(0, fenceIdx).trimEnd()
    }
  }

  const inlineIdx = content.indexOf('aria-artifact')
  if (inlineIdx === -1) return content

  const braceStart = content.indexOf('{', inlineIdx)
  if (braceStart === -1) return content.slice(0, inlineIdx).trimEnd()

  let depth = 0
  for (let i = braceStart; i < content.length; i += 1) {
    if (content[i] === '{') depth += 1
    else if (content[i] === '}') {
      depth -= 1
      if (depth === 0) return content
    }
  }

  return content.slice(0, inlineIdx).trimEnd()
}

function closeOpenCodeFence(content) {
  const fences = content.match(/```/g)
  if (!fences || fences.length % 2 === 0) return content
  return `${content}\n\`\`\``
}
