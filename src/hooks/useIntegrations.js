import { useCallback, useEffect, useState } from 'react'
import { getIdToken } from '@/services/auth/authService'
import {
  getIntegrationStatus,
  refreshIntegrations,
  startIntegrationConnect,
} from '@/services/integrations/integrationsApi'

const BUNDLE_KEY = 'aria_composio_bundle'

export function useIntegrations() {
  const [allConnected, setAllConnected] = useState(false)
  const [partiallyConnected, setPartiallyConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)

  const getToken = useCallback(() => getIdToken(), [])

  const applyStatus = useCallback((data) => {
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

  const continueBundleIfNeeded = useCallback(
    async (data) => {
      const isBundle = sessionStorage.getItem(BUNDLE_KEY) === '1'
      if (data.all_connected || !isBundle) return false

      setNotice('Almost done — finishing setup…')
      setConnecting(true)
      try {
        const redirectUrl = await startIntegrationConnect(getToken)
        window.location.href = redirectUrl
        return true
      } catch (err) {
        sessionStorage.removeItem(BUNDLE_KEY)
        setError(err.message)
        setConnecting(false)
        return false
      }
    },
    [getToken],
  )

  const handleOAuthReturn = useCallback(async () => {
    setLoading(true)
    setNotice(null)
    try {
      const data = await refreshIntegrations(getToken)
      applyStatus(data)

      if (data.all_connected) {
        sessionStorage.removeItem(BUNDLE_KEY)
        setNotice('Gmail and Google Docs connected successfully.')
        return
      }

      const chained = await continueBundleIfNeeded(data)
      if (chained) return

      if (sessionStorage.getItem(BUNDLE_KEY) === '1') {
        setNotice('Connection in progress…')
        return
      }

      setNotice('Google connection updated.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [applyStatus, continueBundleIfNeeded, getToken])

  const connect = useCallback(async () => {
    setConnecting(true)
    setError(null)
    setNotice(null)
    sessionStorage.setItem(BUNDLE_KEY, '1')
    try {
      const redirectUrl = await startIntegrationConnect(getToken)
      window.location.href = redirectUrl
    } catch (err) {
      sessionStorage.removeItem(BUNDLE_KEY)
      setError(err.message)
      setConnecting(false)
    }
  }, [getToken])

  return {
    allConnected,
    partiallyConnected,
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
