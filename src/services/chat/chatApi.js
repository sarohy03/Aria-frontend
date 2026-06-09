const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

async function authFetch(path, options = {}, getToken) {
  const token = await getToken()
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(detail || `API error: ${response.status}`)
  }

  return response
}

export async function listSessions(getToken) {
  const response = await authFetch('/sessions', {}, getToken)
  return response.json()
}

export async function createSession(getToken, title = 'New chat') {
  const response = await authFetch(
    '/sessions',
    { method: 'POST', body: JSON.stringify({ title }) },
    getToken,
  )
  return response.json()
}

export async function getSessionMessages(sessionId, getToken) {
  const response = await authFetch(`/sessions/${sessionId}`, {}, getToken)
  return response.json()
}

export async function deleteSession(sessionId, getToken) {
  const response = await authFetch(
    `/sessions/${sessionId}`,
    { method: 'DELETE' },
    getToken,
  )
  return response.json()
}

export async function streamChat({ message, sessionId, getToken, onEvent, signal }) {
  const token = await getToken()
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message, session_id: sessionId }),
    signal,
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(detail || `Chat error: ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const parts = buffer.split('\n\n')
    buffer = parts.pop() ?? ''

    for (const part of parts) {
      const line = part.trim()
      if (!line.startsWith('data:')) continue
      const payload = line.replace(/^data:\s*/, '')
      if (!payload) continue
      try {
        onEvent(JSON.parse(payload))
      } catch {
        // ignore malformed chunks
      }
    }
  }
}
