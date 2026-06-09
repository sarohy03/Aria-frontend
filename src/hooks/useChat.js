import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
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

  const getToken = useCallback(() => getIdToken(), [])

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

      const userMessage = {
        id: `temp-user-${Date.now()}`,
        role: 'user',
        content: trimmed,
      }
      const assistantPlaceholder = {
        id: `temp-assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        streaming: true,
      }

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
              flushSync(() => {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantPlaceholder.id
                      ? { ...msg, content: msg.content + event.content, toolStatus: null }
                      : msg,
                  ),
                )
              })
            } else if (event.type === 'tool') {
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
            } else if (event.type === 'done') {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantPlaceholder.id
                    ? { ...msg, streaming: false, toolStatus: null }
                    : msg,
                ),
              )
              refreshSessions()
            } else if (event.type === 'error') {
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
            }
          },
        })
      } catch (err) {
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
      } finally {
        setStreaming(false)
        abortRef.current = null
      }
    },
    [activeSessionId, getToken, refreshSessions, streaming],
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
