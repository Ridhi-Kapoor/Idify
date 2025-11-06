const base =
  "inline-flex items-center justify-center rounded-2xl text-sm font-medium transition " +
  "px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50";

const variants = {
  default:  "bg-primary text-primary-foreground hover:brightness-110 shadow-sm",
  secondary:"bg-secondary text-secondary-foreground hover:bg-muted",
  outline:  "border bg-background hover:bg-muted",
};

export function Button({ variant = "default", className = "", ...props }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}
