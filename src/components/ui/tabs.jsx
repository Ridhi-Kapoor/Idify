import React from "react"

export function Tabs({ defaultValue, children, className = "" }) {
  const [value, setValue] = React.useState(defaultValue)
  return (
    <div className={className}>
      {React.Children.map(children, child =>
        React.isValidElement(child) ? React.cloneElement(child, { value, setValue }) : child
      )}
    </div>
  )
}

export function TabsList({ children, className = "", value, setValue }) {
  return (
    <div className={`inline-grid w-full grid-flow-col gap-1 rounded-2xl border bg-secondary p-1 ${className}`}>
      {React.Children.map(children, child => React.cloneElement(child, { value, setValue }))}
    </div>
  )
}

export function TabsTrigger({ value: tabValue, children, className = "", setValue, value }) {
  const active = value === tabValue
  return (
    <button
      onClick={() => setValue(tabValue)}
      className={`rounded-xl px-3 py-2 text-sm transition ${
        active ? "bg-background border shadow-sm" : "opacity-70 hover:opacity-100"
      } ${className}`}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value: tabValue, children, value, className = "" }) {
  if (value !== tabValue) return null
  return <div className={className}>{children}</div>
}
