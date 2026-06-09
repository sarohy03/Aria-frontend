import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock'
import { remarkBreaks } from './remarkBreaks'

const components = {
  h1: ({ children }) => (
    <h1 className="mb-3 mt-6 text-xl font-semibold tracking-tight text-white first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2.5 mt-5 text-lg font-semibold tracking-tight text-white first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-4 text-base font-semibold text-zinc-100 first:mt-0">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-1.5 mt-3 text-sm font-semibold text-zinc-200 first:mt-0">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="mb-3 text-[0.9375rem] leading-7 text-zinc-300 last:mb-0">{children}</p>
  ),
  strong: ({ children }) => <strong className="font-semibold text-zinc-100">{children}</strong>,
  em: ({ children }) => <em className="italic text-zinc-300">{children}</em>,
  ul: ({ children }) => (
    <ul className="mb-3 list-disc space-y-1.5 pl-6 text-[0.9375rem] leading-7 text-zinc-300 last:mb-0">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1.5 pl-6 text-[0.9375rem] leading-7 text-zinc-300 last:mb-0">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-2 border-violet-500/50 bg-violet-500/[0.06] py-1 pl-4 text-zinc-300">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-white/[0.08]" />,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-violet-300 underline decoration-violet-500/40 underline-offset-2 transition-colors hover:text-violet-200 hover:decoration-violet-400"
    >
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-xl border border-white/[0.08]">
      <table className="w-full min-w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b border-white/[0.08] bg-white/[0.04]">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-white/[0.06]">{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => (
    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-zinc-400">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="px-4 py-2.5 text-zinc-300">{children}</td>,
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '')
    const text = String(children).replace(/\n$/, '')
    const isBlock = Boolean(match) || text.includes('\n')

    if (!isBlock) {
      return (
        <code
          className="rounded-md border border-white/[0.08] bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-violet-200"
          {...props}
        >
          {children}
        </code>
      )
    }

    return <CodeBlock language={match?.[1]}>{children}</CodeBlock>
  },
  pre: ({ children }) => <>{children}</>,
}

export default function MarkdownRenderer({ content }) {
  if (!content?.trim()) return null

  return (
    <div className="markdown-body text-left">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
