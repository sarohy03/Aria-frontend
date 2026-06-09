export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Connect',
      description: 'Sign in with email or Google. Aria links to your Gmail and Google Docs securely.',
    },
    {
      step: '02',
      title: 'Chat',
      description: 'Ask in plain English. Aria fetches, drafts, searches, and acts on your behalf.',
    },
    {
      step: '03',
      title: 'Done',
      description: 'Emails sent, files found, work handled — without leaving the conversation.',
    },
  ]

  return (
    <section className="relative border-t border-white/[0.04] bg-[#030303] px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-20 text-center">
          <p className="mb-4 text-sm font-medium tracking-widest text-zinc-500 uppercase">How it works</p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Up and running in under a minute
          </h2>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-zinc-900 text-xs font-medium text-zinc-300">
                {item.step}
              </div>
              <h3 className="mb-3 font-medium text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
