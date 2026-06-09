import { useCallback, useEffect, useRef, useState } from 'react'
import { getIdToken } from '@/services/auth/authService'
import {
  createSession,
  deleteSession as deleteSessionApi,
  getSessionMessages,
  listSessions,
  streamChat,
} from '@/services/chat/chatApi'

export function useChat() {
  const [sessions, setSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [streaming, setStreaming] = useState(false)
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)
  const tokenBufferRef = useRef('')
  const flushRafRef = useRef(null)
  const assistantIdRef = useRef(null)

  const getToken = useCallback(() => getIdToken(), [])

  const flushTokenBuffer = useCallback(() => {
    flushRafRef.current = null
    const chunk = tokenBufferRef.current
    const assistantId = assistantIdRef.current
    if (!chunk || !assistantId) return

    tokenBufferRef.current = ''
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === assistantId
          ? { ...msg, content: msg.content + chunk, toolStatus: null }
          : msg,
      ),
    )
  }, [])

  const scheduleTokenFlush = useCallback(() => {
    if (flushRafRef.current != null) return
    flushRafRef.current = requestAnimationFrame(flushTokenBuffer)
  }, [flushTokenBuffer])

  const appendToken = useCallback(
    (token) => {
      tokenBufferRef.current += token
      scheduleTokenFlush()
    },
    [scheduleTokenFlush],
  )

  const flushTokensNow = useCallback(() => {
    if (flushRafRef.current != null) {
      cancelAnimationFrame(flushRafRef.current)
      flushRafRef.current = null
    }
    flushTokenBuffer()
  }, [flushTokenBuffer])

  useEffect(() => {
    return () => {
      if (flushRafRef.current != null) {
        cancelAnimationFrame(flushRafRef.current)
      }
    }
  }, [])

  const refreshSessions = useCallback(async () => {
    try {
      const data = await listSessions(getToken)
      setSessions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingSessions(false)
    }
  }, [getToken])

  useEffect(() => {
    refreshSessions()
  }, [refreshSessions])

  const loadSession = useCallback(
    async (sessionId) => {
      if (!sessionId) {
        setActiveSessionId(null)
        setMessages([])
        return
      }
      setLoadingMessages(true)
      setError(null)
      try {
        const data = await getSessionMessages(sessionId, getToken)
        setActiveSessionId(sessionId)
        setMessages(data.messages ?? [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoadingMessages(false)
      }
    },
    [getToken],
  )

  const startNewChat = useCallback(async () => {
    setError(null)
    setActiveSessionId(null)
    setMessages([])
  }, [])

  const createNewSession = useCallback(async () => {
    setError(null)
    try {
      const session = await createSession(getToken)
      setSessions((prev) => [session, ...prev])
      setActiveSessionId(session.id)
      setMessages([])
      return session.id
    } catch (err) {
      setError(err.message)
      return null
    }
  }, [getToken])

  const removeSession = useCallback(
    async (sessionId) => {
      setError(null)
      try {
        await deleteSessionApi(sessionId, getToken)
        setSessions((prev) => prev.filter((s) => s.id !== sessionId))
        if (activeSessionId === sessionId) {
          setActiveSessionId(null)
          setMessages([])
        }
      } catch (err) {
        setError(err.message)
      }
    },
    [activeSessionId, getToken],
  )

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim()
      if (!trimmed || streaming) return

      setError(null)
      setStreaming(true)
      tokenBufferRef.current = ''
      assistantIdRef.current = null

      const userMessage = {
        id: `temp-user-${Date.now()}`,
        role: 'user',
        content: trimmed,
      }
      const assistantPlaceholder = {
        id: `temp-assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        artifacts: [],
        streaming: true,
      }
      assistantIdRef.current = assistantPlaceholder.id

      setMessages((prev) => [...prev, userMessage, assistantPlaceholder])

      let sessionId = activeSessionId
      const controller = new AbortController()
      abortRef.current = controller

      try {
        await streamChat({
          message: trimmed,
          sessionId,
          getToken,
          signal: controller.signal,
          onEvent: (event) => {
            if (event.type === 'session') {
              sessionId = event.session_id
              setActiveSessionId(sessionId)
              setSessions((prev) => {
                const exists = prev.some((s) => s.id === sessionId)
                if (exists) return prev
                return [
                  {
                    id: event.session_id,
                    title: event.title ?? 'New chat',
                  },
                  ...prev,
                ]
              })
            } else if (event.type === 'token') {
              appendToken(event.content)
            } else if (event.type === 'tool') {
              flushTokensNow()
              if (event.status === 'start') {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantPlaceholder.id
                      ? { ...msg, toolStatus: event.label || 'Working on it…' }
                      : msg,
                  ),
                )
              } else if (event.status === 'done') {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantPlaceholder.id
                      ? { ...msg, toolStatus: 'Finishing up…' }
                      : msg,
                  ),
                )
              }
            } else if (event.type === 'artifact' && event.artifact) {
              flushTokensNow()
              setMessages((prev) =>
                prev.map((msg) => {
                  if (msg.id !== assistantPlaceholder.id) return msg
                  const arts = msg.artifacts ?? []
                  const incoming = event.artifact
                  const idx = incoming.id
                    ? arts.findIndex((a) => a.id === incoming.id)
                    : -1
                  if (idx >= 0) {
                    const next = [...arts]
                    next[idx] = { ...next[idx], ...incoming }
                    return { ...msg, artifacts: next }
                  }
                  return { ...msg, artifacts: [...arts, incoming] }
                }),
              )
            } else if (event.type === 'done') {
              flushTokensNow()
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantPlaceholder.id
                    ? { ...msg, streaming: false, toolStatus: null }
                    : msg,
                ),
              )
              assistantIdRef.current = null
              refreshSessions()
            } else if (event.type === 'error') {
              flushTokensNow()
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantPlaceholder.id
                    ? {
                        ...msg,
                        streaming: false,
                        toolStatus: null,
                        error: event.message || 'Something went wrong',
                      }
                    : msg,
                ),
              )
              assistantIdRef.current = null
            }
          },
        })
      } catch (err) {
        flushTokensNow()
        if (err.name !== 'AbortError') {
          setError(err.message)
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantPlaceholder.id
                ? {
                    ...msg,
                    streaming: false,
                    toolStatus: null,
                    error: err.message,
                  }
                : msg,
            ),
          )
        }
        assistantIdRef.current = null
      } finally {
        setStreaming(false)
        abortRef.current = null
      }
    },
    [activeSessionId, appendToken, flushTokensNow, getToken, refreshSessions, streaming],
  )

  return {
    sessions,
    activeSessionId,
    messages,
    streaming,
    loadingSessions,
    loadingMessages,
    error,
    loadSession,
    startNewChat,
    createNewSession,
    removeSession,
    sendMessage,
    refreshSessions,
  }
}
