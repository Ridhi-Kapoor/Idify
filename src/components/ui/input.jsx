export function Input({ className = "", ...props }) {
  return (
    <input
      className={`h-10 w-full rounded-xl border bg-background/80 backdrop-blur px-3 text-sm
        outline-none focus:ring-2 focus:ring-ring shadow-xs ${className}`}
      {...props}
    />
  )
}
