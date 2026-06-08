import { motion } from 'framer-motion'

export default function ChatPreview() {
  return (
    <section className="relative bg-[#030303] px-6 pb-32 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        className="mx-auto max-w-2xl"
      >
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-sm">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
            <span className="ml-2 text-xs text-zinc-400">Aria</span>
          </div>
          <div className="space-y-4 p-6 text-left">
            <Message role="user" text="What emails did I get today?" />
            <Message
              role="aria"
              text="You received 7 emails today. 3 from clients, 2 invoices, 1 meeting invite, and 1 newsletter."
            />
            <Message role="user" text="Draft a reply to Ahmed's invoice email" />
            <Message
              role="aria"
              text="Here's a draft: Hi Ahmed, thank you for sending the invoice. I'll review it and get back to you by tomorrow..."
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function Message({ role, text }) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-zinc-800 text-zinc-100'
            : 'border border-white/10 bg-zinc-800/60 text-zinc-200'
        }`}
      >
        {!isUser && (
          <span className="mb-1 block text-xs font-medium text-zinc-400">
            Aria
          </span>
        )}
        {text}
      </div>
    </div>
  )
}
