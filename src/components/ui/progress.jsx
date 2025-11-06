export function Progress({ value = 0, className = "" }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className={`h-2 w-full rounded-full bg-muted overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
        style={{ width: `${v}%` }}
      />
    </div>
  )
}
  