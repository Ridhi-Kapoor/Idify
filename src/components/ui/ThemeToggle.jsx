export default function ThemeToggle() {
  const toggle = () => {
    const el = document.documentElement
    el.classList.toggle("dark")
    localStorage.setItem("theme", el.classList.contains("dark") ? "dark" : "light")
  }

  // load saved preference
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("theme")
    const el = document.documentElement
    if (saved === "dark") el.classList.add("dark")
  }

  return (
    <button
      onClick={toggle}
      className="rounded-xl border px-3 py-1.5 text-xs bg-background hover:bg-muted"
      title="Toggle theme"
    >
      Toggle Theme
    </button>
  )
}

