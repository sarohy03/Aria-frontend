import { useCallback, useEffect, useState } from 'react'
import { getIdToken } from '@/services/auth/authService'
import {
  getIntegrationStatus,
  refreshIntegrations,
  startIntegrationConnect,
} from '@/services/integrations/integrationsApi'

export function useIntegrations() {
  const [integrations, setIntegrations] = useState([])
  const [allConnected, setAllConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(null)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)

  const getToken = useCallback(() => getIdToken(), [])

  const loadStatus = useCallback(async () => {
    setError(null)
    try {
      const data = await getIntegrationStatus(getToken)
      setIntegrations(data.integrations ?? [])
      setAllConnected(Boolean(data.all_connected))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    loadStatus()
  }, [loadStatus])

  const handleOAuthReturn = useCallback(async (toolkitSlug) => {
    setLoading(true)
    setNotice(null)
    try {
      const data = await refreshIntegrations(getToken)
      setIntegrations(data.integrations ?? [])
      setAllConnected(Boolean(data.all_connected))
      const label =
        data.integrations?.find((i) => i.slug === toolkitSlug)?.label ?? 'App'
      const connected = data.integrations?.find((i) => i.slug === toolkitSlug)?.connected
      setNotice(
        connected ? `${label} connected successfully.` : `${label} connection pending…`,
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  const connect = useCallback(
    async (toolkit) => {
      setConnecting(toolkit)
      setError(null)
      setNotice(null)
      try {
        const redirectUrl = await startIntegrationConnect(toolkit, getToken)
        window.location.href = redirectUrl
      } catch (err) {
        setError(err.message)
        setConnecting(null)
      }
    },
    [getToken],
  )

  return {
    integrations,
    allConnected,
    loading,
    connecting,
    error,
    notice,
    connect,
    loadStatus,
    handleOAuthReturn,
    clearNotice: () => setNotice(null),
  }
}
