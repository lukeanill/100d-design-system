const RADIUS_TOKENS = [
  { name: "radius-sm", label: "sm", value: "0.5rem", className: "rounded-sm" },
  { name: "radius-md", label: "md", value: "0.625rem", className: "rounded-md" },
  { name: "radius-lg", label: "lg", value: "0.875rem", className: "rounded-lg" },
  { name: "radius-xl", label: "xl", value: "1.25rem", className: "rounded-xl" },
  { name: "radius-full", label: "full", value: "9999px", className: "rounded-full" },
] as const

export default { title: "Tokens/Radius", parameters: { layout: "fullscreen" } }

export const Radius = () => (
  <div className="min-h-screen w-full bg-card">
   <div className="mx-auto flex max-w-5xl flex-col gap-16 p-10">
    <header className="flex flex-col gap-3 border-b border-muted pb-8">
      <p className="font-sans text-xs font-medium tracking-wide text-secondary-foreground uppercase">
        Tokens &middot; Radius
      </p>
      <h1 className="font-heading text-4xl font-normal text-foreground">Radius</h1>
    </header>

    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {RADIUS_TOKENS.map((r) => (
        <div
          key={r.name}
          className="flex flex-col items-center gap-4 rounded-xl border border-muted bg-card px-6 py-8 shadow-xs"
        >
          <div className={`size-20 border-2 border-primary bg-muted ${r.className}`} />
          <div className="flex flex-col items-center gap-0.5 text-center">
            <div className="text-sm font-medium text-foreground">{r.label}</div>
            <div className="font-mono text-xs text-secondary-foreground">{r.value}</div>
            <div className="font-mono text-xs text-secondary-foreground">--{r.name}</div>
          </div>
        </div>
      ))}
    </div>
   </div>
  </div>
)
