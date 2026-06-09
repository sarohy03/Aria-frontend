import { Check, Copy } from 'lucide-react'
import { useCallback, useState } from 'react'

const LANG_LABELS = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  py: 'Python',
  python: 'Python',
  json: 'JSON',
  bash: 'Bash',
  sh: 'Shell',
  sql: 'SQL',
  html: 'HTML',
  css: 'CSS',
  md: 'Markdown',
  markdown: 'Markdown',
}

function languageLabel(lang) {
  if (!lang) return 'Code'
  const key = lang.toLowerCase()
  return LANG_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1)
}

export default function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false)
  const code = String(children).replace(/\n$/, '')

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }, [code])

  return (
    <div className="group my-4 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0b]">
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.03] px-3 py-2">
        <span className="text-[11px] font-medium text-zinc-500">{languageLabel(language)}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-zinc-500 opacity-0 transition-all hover:bg-white/[0.06] hover:text-zinc-300 group-hover:opacity-100"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[0.8125rem] leading-relaxed">
        <code className="font-mono text-zinc-200">{code}</code>
      </pre>
    </div>
  )
}
