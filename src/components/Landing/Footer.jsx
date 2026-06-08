import Logo from '../ui/Logo'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-[#030303] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <Logo />
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Aria
        </p>
      </div>
    </footer>
  )
}
