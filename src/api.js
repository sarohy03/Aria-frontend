const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

export function getHealth() {
  return request('/health')
}

/** Fire-and-forget ping to wake cold backends (e.g. Render free tier). */
export function warmBackend() {
  fetch(`${API_BASE}/health`, { method: 'GET' }).catch(() => {})
}

export function getMessage() {
  return request('/')
}
