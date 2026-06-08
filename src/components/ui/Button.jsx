const variants = {
  primary:
    'bg-white text-[#030303] hover:bg-white/90 shadow-[0_0_24px_rgba(255,255,255,0.12)]',
  secondary:
    'border border-white/15 bg-white/[0.08] text-zinc-200 hover:border-white/25 hover:bg-white/[0.12]',
  ghost:
    'text-zinc-300 hover:text-white hover:bg-white/[0.06]',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
