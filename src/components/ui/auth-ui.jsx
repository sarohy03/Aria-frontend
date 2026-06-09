import * as React from 'react'
import { useState, useId } from 'react'
import { Slot } from '@radix-ui/react-slot'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva } from 'class-variance-authority'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Typewriter } from './typewriter'
import GoogleIcon from './GoogleIcon'
import Logo from './Logo'

const labelVariants = cva(
  'text-sm font-medium leading-none text-zinc-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
)

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-white text-[#030303] hover:bg-zinc-200',
        outline:
          'border border-white/15 bg-white/[0.04] text-zinc-100 hover:border-white/25 hover:bg-white/[0.08]',
        ghost: 'text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200',
        link: 'text-zinc-300 underline-offset-4 hover:text-white hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        lg: 'h-11 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
})
Button.displayName = 'Button'

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      'flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-100 shadow-sm transition-colors placeholder:text-zinc-500 focus-visible:border-white/20 focus-visible:bg-white/[0.06] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    ref={ref}
    {...props}
  />
))
Input.displayName = 'Input'

const PasswordInput = React.forwardRef(({ className, label, id: idProp, ...props }, ref) => {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="grid w-full items-center gap-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          className={cn('pe-10', className)}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 end-0 flex h-full w-10 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-300 focus-visible:outline-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  )
})
PasswordInput.displayName = 'PasswordInput'

function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
      {message}
    </div>
  )
}

function InfoBanner({ message }) {
  if (!message) return null
  return (
    <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-sm text-indigo-100">
      {message}
    </div>
  )
}

function SignInForm({ onSubmit, loading, error, infoMessage, defaultEmail = '' }) {
  return (
    <form onSubmit={onSubmit} autoComplete="on" className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-white">Sign in to Aria</h1>
        <p className="text-sm text-zinc-400">Welcome back. Pick up where you left off.</p>
      </div>

      <ErrorBanner message={error} />
      <InfoBanner message={infoMessage} />

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="signin-email">Email</Label>
          <Input
            id="signin-email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
            autoComplete="email"
            defaultValue={defaultEmail}
            disabled={loading}
          />
        </div>
        <PasswordInput
          id="signin-password"
          name="password"
          label="Password"
          required
          autoComplete="current-password"
          placeholder="Your password"
          disabled={loading}
        />
        <Button type="submit" variant="default" size="lg" className="mt-1 w-full" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : 'Sign In'}
        </Button>
      </div>
    </form>
  )
}

function SignUpForm({ onSubmit, loading, error }) {
  return (
    <form onSubmit={onSubmit} autoComplete="on" className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        <p className="text-sm text-zinc-400">Start managing your work through one chat.</p>
      </div>

      <ErrorBanner message={error} />

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="signup-name">Full name</Label>
          <Input
            id="signup-name"
            name="name"
            type="text"
            placeholder="Alex Morgan"
            required
            autoComplete="name"
            disabled={loading}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
            autoComplete="email"
            disabled={loading}
          />
        </div>
        <PasswordInput
          id="signup-password"
          name="password"
          label="Password"
          required
          autoComplete="new-password"
          placeholder="At least 6 characters"
          minLength={6}
          disabled={loading}
        />
        <PasswordInput
          id="signup-confirm"
          name="confirmPassword"
          label="Confirm password"
          required
          autoComplete="new-password"
          placeholder="Repeat your password"
          minLength={6}
          disabled={loading}
        />
        <Button type="submit" variant="default" size="lg" className="mt-1 w-full" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : 'Create Account'}
        </Button>
      </div>
    </form>
  )
}

function AuthShowcase({ quote }) {
  return (
    <div className="relative hidden overflow-hidden bg-[#030303] md:block">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-rose-500/10" />
      <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-indigo-500/20 blur-[100px]" />
      <div className="absolute -right-16 bottom-1/4 h-64 w-64 rounded-full bg-rose-500/15 blur-[90px]" />
      <div className="absolute left-1/3 top-1/2 h-48 w-48 rounded-full bg-violet-500/10 blur-[80px]" />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 flex h-full min-h-screen flex-col items-center justify-between p-10">
        <div className="pt-8">
          <Logo />
        </div>

        <div className="mx-auto max-w-md space-y-6 text-center">
          <blockquote className="space-y-4">
            <p className="text-2xl font-medium leading-snug text-white">
              &ldquo;
              <Typewriter key={quote.text} text={quote.text} speed={45} />
              &rdquo;
            </p>
            <cite className="block text-sm not-italic text-zinc-500">{quote.author}</cite>
          </blockquote>
        </div>

        <p className="pb-4 text-xs text-zinc-600">Gmail &amp; Google Docs connected</p>
      </div>
    </div>
  )
}

const SIGN_IN_QUOTE = {
  text: 'Welcome back. Your Chief of Staff is ready.',
  author: 'Aria',
}

const SIGN_UP_QUOTE = {
  text: 'One chat. Your entire work life.',
  author: 'Aria',
}

export function AuthUI({
  isSignIn,
  onToggle,
  onSignIn,
  onSignUp,
  onGoogleSignIn,
  loading = false,
  error = '',
  infoMessage = '',
  defaultEmail = '',
}) {
  return (
    <div className="min-h-screen w-full bg-[#030303] md:grid md:grid-cols-2">
      <div className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between p-6 md:hidden">
          <Logo />
          <Link to="/" className="text-sm text-zinc-400 hover:text-white">
            Back
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-[380px]">
            {isSignIn ? (
              <SignInForm
                onSubmit={onSignIn}
                loading={loading}
                error={error}
                infoMessage={infoMessage}
                defaultEmail={defaultEmail}
              />
            ) : (
              <SignUpForm onSubmit={onSignUp} loading={loading} error={error} />
            )}

            <div className="mt-6 text-center text-sm text-zinc-400">
              {isSignIn ? "Don't have an account?" : 'Already have an account?'}{' '}
              <Button variant="link" className="h-auto p-0" type="button" onClick={onToggle} disabled={loading}>
                {isSignIn ? 'Sign up' : 'Sign in'}
              </Button>
            </div>

            <div className="relative my-6 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-white/10">
              <span className="relative z-10 bg-[#030303] px-3 text-zinc-500">Or continue with</span>
            </div>

            <Button
              variant="outline"
              size="lg"
              type="button"
              className="w-full"
              onClick={onGoogleSignIn}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <GoogleIcon />
                  Google
                </>
              )}
            </Button>

            <p className="mt-8 hidden text-center md:block">
              <Link to="/" className="text-sm text-zinc-500 transition-colors hover:text-zinc-300">
                &larr; Back to home
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AuthShowcase quote={isSignIn ? SIGN_IN_QUOTE : SIGN_UP_QUOTE} />
    </div>
  )
}
