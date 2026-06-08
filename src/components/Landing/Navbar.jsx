import Logo from '../ui/Logo'
import Button from '../ui/Button'

export default function Navbar({ onGetStarted }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#030303]/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-6">
          <a
            href="#features"
            className="hidden text-sm text-zinc-300 transition-colors hover:text-white sm:inline"
          >
            Features
          </a>
          <Button variant="secondary" className="px-5 py-2.5 text-sm" onClick={onGetStarted}>
            Get Started
          </Button>
        </div>
      </nav>
    </header>
  )
}
