const base = "inline-flex items-center rounded-xl px-2.5 py-1 text-xs font-medium";
const variants = {
  default: "bg-primary/15 text-primary border border-primary/20",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "border",
};
export function Badge({ variant = "default", className = "", ...props }) {
  return <span className={`${base} ${variants[variant]} ${className}`} {...props} />
}
