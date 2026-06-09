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

  return response.json()
}

export function getIntegrationStatus(getToken) {
  return authFetch('/integrations/status', {}, getToken)
}

export function refreshIntegrations(getToken) {
  return authFetch('/integrations/refresh', { method: 'POST' }, getToken)
}

export function getComposioCallbackUrl() {
  return `${window.location.origin}/chat?connected=composio`
}

export async function startIntegrationConnect(getToken) {
  const data = await authFetch(
    '/integrations/connect',
    {
      method: 'POST',
      body: JSON.stringify({ callback_url: getComposioCallbackUrl() }),
    },
    getToken,
  )
  return data.redirect_url
}
