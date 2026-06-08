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

export function getMessage() {
  return request('/')
}
