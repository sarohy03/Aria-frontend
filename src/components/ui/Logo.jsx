export default function Logo({ className = '', showWordmark = true }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/favicon.svg"
        alt="Aria"
        className="h-8 w-8"
        width={32}
        height={32}
      />
      {showWordmark && (
        <span className="text-lg font-semibold tracking-tight text-white">Aria</span>
      )}
    </div>
  )
}
