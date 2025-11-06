export function Card({ className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl border bg-card/90 backdrop-blur-sm text-card-foreground shadow-sm hover:shadow-md transition-shadow ${className}`}
      {...props}
    />
  )
}
export function CardHeader({ className = "", ...props }) {
  return <div className={`p-4 border-b bg-gradient-to-b from-white/60 to-transparent ${className}`} {...props} />
}
export function CardTitle({ className = "", ...props }) {
  return <h3 className={`text-base font-semibold tracking-tight ${className}`} {...props} />
}
export function CardContent({ className = "", ...props }) {
  return <div className={`p-4 ${className}`} {...props} />
}
