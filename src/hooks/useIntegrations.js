import { useCallback, useEffect, useState } from 'react'
import { getIdToken } from '@/services/auth/authService'
import {
  getIntegrationStatus,
  refreshIntegrations,
  startToolkitConnect,
} from '@/services/integrations/integrationsApi'

export function useIntegrations() {
  const [integrations, setIntegrations] = useState([])
  const [allConnected, setAllConnected] = useState(false)
  const [partiallyConnected, setPartiallyConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [connectingToolkit, setConnectingToolkit] = useState(null)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)

  const getToken = useCallback(() => getIdToken(), [])

  const applyStatus = useCallback((data) => {
    setIntegrations(data.integrations ?? [])
    setAllConnected(Boolean(data.all_connected))
    setPartiallyConnected(Boolean(data.partially_connected))
  }, [])

  const loadStatus = useCallback(async () => {
    setError(null)
    try {
      const data = await getIntegrationStatus(getToken)
      applyStatus(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [applyStatus, getToken])

  useEffect(() => {
    loadStatus()
  }, [loadStatus])

  const handleOAuthReturn = useCallback(async () => {
    setLoading(true)
    setNotice(null)
    setConnectingToolkit(null)
    try {
      const data = await refreshIntegrations(getToken)
      applyStatus(data)

      const connected = (data.integrations ?? []).filter((item) => item.connected)
      if (data.all_connected) {
        setNotice('Gmail and Google Docs connected successfully.')
      } else if (connected.length === 1) {
        setNotice(`${connected[0].label} connected. Connect the other service when ready.`)
      } else {
        setNotice('Google connection updated.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [applyStatus, getToken])

  const connectToolkit = useCallback(
    async (toolkit) => {
      setConnectingToolkit(toolkit)
      setError(null)
      setNotice(null)
      try {
        const redirectUrl = await startToolkitConnect(getToken, toolkit)
        window.location.href = redirectUrl
      } catch (err) {
        setError(err.message)
        setConnectingToolkit(null)
      }
    },
    [getToken],
  )

  return {
    integrations,
    allConnected,
    partiallyConnected,
    loading,
    connectingToolkit,
    error,
    notice,
    connectToolkit,
    loadStatus,
    handleOAuthReturn,
    clearNotice: () => setNotice(null),
  }
}
