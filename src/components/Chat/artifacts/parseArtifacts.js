const ARTIFACT_FENCE = /```aria-artifact\s*\n([\s\S]*?)```/g

function mergeArtifact(existing, incoming) {
  const merged = { ...existing, ...incoming }
  if (existing.status === 'ready' || incoming.status === 'ready') {
    merged.status = 'ready'
  }
  return merged
}

export function normalizeArtifact(data) {
  if (!data) return data
  if (data.status !== 'loading') return data

  const hasContent =
    (data.documents?.length ?? 0) > 0 ||
    Boolean(data.preview || data.summary || data.body) ||
    (Boolean(data.url) && Boolean(data.title))

  return hasContent ? { ...data, status: 'ready' } : data
}

export function dedupeArtifacts(artifacts) {
  const byKey = new Map()
  const order = []

  for (const raw of artifacts) {
    const data = normalizeArtifact(raw)
    const key =
      data.id ||
      data.url ||
      data.document_id ||
      `${data.type}-${data.title || order.length}`

    if (byKey.has(key)) {
      byKey.set(key, mergeArtifact(byKey.get(key), data))
      continue
    }

    byKey.set(key, data)
    order.push(key)
  }

  const readyIds = new Set(
    order
      .filter((key) => byKey.get(key)?.status === 'ready')
      .map((key) => byKey.get(key)?.id)
      .filter(Boolean),
  )

  return order
    .map((key) => byKey.get(key))
    .filter((data) => data.status !== 'loading' || !readyIds.has(data.id))
}

function findInlineArtifactMatches(content) {
  const matches = []
  const marker = 'aria-artifact'
  let searchFrom = 0

  while (searchFrom < content.length) {
    const idx = content.indexOf(marker, searchFrom)
    if (idx === -1) break

    let i = idx + marker.length
    while (i < content.length && /\s/.test(content[i])) i += 1

    if (content[i] !== '{') {
      searchFrom = idx + 1
      continue
    }

    const jsonStart = i
    let depth = 0
    for (; i < content.length; i += 1) {
      if (content[i] === '{') depth += 1
      else if (content[i] === '}') {
        depth -= 1
        if (depth === 0) {
          matches.push({
            start: idx,
            end: i + 1,
            raw: content.slice(jsonStart, i + 1),
          })
          break
        }
      }
    }

    searchFrom = idx + 1
  }

  return matches
}

function findAllArtifactMatches(content) {
  const matches = []

  ARTIFACT_FENCE.lastIndex = 0
  let match
  while ((match = ARTIFACT_FENCE.exec(content)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      raw: match[1],
    })
  }

  for (const inline of findInlineArtifactMatches(content)) {
    const overlaps = matches.some(
      (existing) => inline.start >= existing.start && inline.start < existing.end,
    )
    if (!overlaps) matches.push(inline)
  }

  return matches.sort((a, b) => a.start - b.start)
}

function pushArtifact(parts, artifactIndexById, data) {
  const normalized = normalizeArtifact(data)
  const mergeKey = normalized.id || normalized.url || normalized.document_id

  if (mergeKey && artifactIndexById.has(mergeKey)) {
    const idx = artifactIndexById.get(mergeKey)
    parts[idx] = {
      type: 'artifact',
      data: mergeArtifact(parts[idx].data, normalized),
    }
    return
  }

  parts.push({ type: 'artifact', data: normalized })
  if (mergeKey) {
    artifactIndexById.set(mergeKey, parts.length - 1)
  } else if (normalized.id) {
    artifactIndexById.set(normalized.id, parts.length - 1)
  }
}

export function parseMessageParts(content) {
  if (!content) return [{ type: 'markdown', content: '' }]

  const matches = findAllArtifactMatches(content)
  if (!matches.length) return [{ type: 'markdown', content }]

  const parts = []
  const artifactIndexById = new Map()
  let lastIndex = 0

  for (const found of matches) {
    if (found.start > lastIndex) {
      const text = content.slice(lastIndex, found.start).trim()
      if (text) parts.push({ type: 'markdown', content: text })
    }

    try {
      pushArtifact(parts, artifactIndexById, JSON.parse(found.raw.trim()))
    } catch {
      // Drop malformed artifact markers from the UI
    }

    lastIndex = found.end
  }

  const tail = content.slice(lastIndex).trim()
  if (tail) parts.push({ type: 'markdown', content: tail })

  return parts.length ? parts : [{ type: 'markdown', content: '' }]
}
