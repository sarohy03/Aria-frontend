import Button from '../ui/Button'

export default function CTASection({ onGetStarted }) {
  return (
    <section className="relative bg-[#030303] px-6 py-32">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-zinc-900/60 px-8 py-16 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to meet your Chief of Staff?
        </h2>
        <p className="mb-8 text-zinc-300">
          Join business owners who manage their entire work life through one chat.
        </p>
        <Button variant="primary" className="px-8 py-4 text-base" onClick={onGetStarted}>
          Get Started
        </Button>
        <p className="mt-4 text-sm text-zinc-500">
          Sign in with email or Google
        </p>
      </div>
    </section>
  )
}
