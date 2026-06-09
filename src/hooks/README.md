# hooks

React hooks for shared state and side effects.

| File | Purpose |
|---|---|
| `useAuth.js` | Reads auth state from `AuthContext` (requires `AuthProvider`) |
| `useChat.js` | Sessions, messages, and SSE streaming for `/chat` |
| `useIntegrations.js` | Gmail/Drive Composio OAuth status and connect flow |

Provider lives in `components/Auth/AuthProvider.jsx`.
