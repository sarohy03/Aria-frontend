import { Mail, Send, FileText, FilePlus, GitBranch, Brain } from 'lucide-react'

const features = [
  {
    icon: Mail,
    title: 'Email at a glance',
    description: 'Ask what came in today, filter by sender, or find unread client messages — summarized instantly.',
    example: '"What emails did I get today?"',
  },
  {
    icon: Send,
    title: 'Draft & send replies',
    description: 'Aria reads the thread, writes a professional reply, and sends it when you confirm.',
    example: '"Draft a reply to Ahmed\'s invoice email"',
  },
  {
    icon: FileText,
    title: 'Search your Docs',
    description: 'Find Google Docs by title or recent edits without digging through folders.',
    example: '"Find my proposal from last month"',
  },
  {
    icon: FilePlus,
    title: 'Create & edit Docs',
    description: 'Turn summaries and notes into Google Docs, or update existing ones in place.',
    example: '"Create a Google Doc with this meeting summary"',
  },
  {
    icon: GitBranch,
    title: 'Cross-tool workflows',
    description: 'Pull context from Gmail and turn it into a Doc — in one conversation.',
    example: '"Summarize John\'s contract email in a new Google Doc"',
  },
  {
    icon: Brain,
    title: 'Full memory',
    description: 'Aria remembers everything in your session. Pick up right where you left off.',
    example: '"What did we just do?"',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative bg-[#030303] px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-20 text-center">
          <p className="mb-4 text-sm font-medium tracking-widest text-zinc-500 uppercase">Capabilities</p>
          <h2 className="mb-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need,{' '}
            <span className="bg-gradient-to-r from-indigo-200 to-rose-200 bg-clip-text text-transparent">
              one conversation
            </span>
          </h2>
          <p className="mx-auto max-w-lg text-zinc-300">
            Built for small business owners who are tired of switching between inbox, files, and tabs.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-2xl border border-white/10 bg-zinc-900/50 p-6 transition-all duration-300 hover:border-white/20 hover:bg-zinc-900/80"
            >
              <feature.icon className="mb-4 h-5 w-5 text-zinc-400 transition-colors group-hover:text-zinc-200" strokeWidth={1.5} />
              <h3 className="mb-2 font-medium text-white">{feature.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-zinc-300">
                {feature.description}
              </p>
              <p className="rounded-lg border border-white/10 bg-zinc-800/50 px-3 py-2 text-xs italic text-zinc-400">
                {feature.example}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
