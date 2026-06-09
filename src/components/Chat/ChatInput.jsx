import { useEffect, useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`
  }, [value])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!value.trim() || disabled) return
    onSend(value)
    setValue('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit(event)
    }
  }

  const canSend = value.trim() && !disabled

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#030303] via-[#030303]/95 to-transparent px-4 pb-5 pt-10">
      <form
        onSubmit={handleSubmit}
        className="pointer-events-auto mx-auto max-w-3xl"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-white/[0.1] bg-zinc-900/80 p-2 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-colors focus-within:border-white/20 focus-within:shadow-[0_8px_40px_rgba(88,28,135,0.15)]">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Aria…"
            rows={1}
            disabled={disabled}
            className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm leading-relaxed text-zinc-100 placeholder:text-zinc-500 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!canSend}
            className={`mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all ${
              canSend
                ? 'bg-white text-zinc-900 shadow-md hover:bg-zinc-100'
                : 'bg-zinc-800 text-zinc-600'
            } disabled:cursor-not-allowed`}
            aria-label="Send message"
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-zinc-600">
          Enter to send · Shift+Enter for new line
        </p>
      </form>
    </div>
  )
}
