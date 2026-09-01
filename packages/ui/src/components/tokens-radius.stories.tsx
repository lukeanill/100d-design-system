const RADIUS_TOKENS = [
  { name: "radius-sm", label: "sm", className: "rounded-sm" },
  { name: "radius-md", label: "md", className: "rounded-md" },
  { name: "radius-lg", label: "lg (base)", className: "rounded-lg" },
  { name: "radius-xl", label: "xl", className: "rounded-xl" },
  { name: "radius-full", label: "full", className: "rounded-full" },
] as const

export default { title: "Tokens/Radius" }

export const Radius = () => (
  <div className="mx-auto flex max-w-4xl flex-col gap-4 p-8">
    <h2 className="text-lg font-semibold">Radius</h2>
    <div className="flex flex-wrap gap-4">
      {RADIUS_TOKENS.map((r) => (
        <div key={r.name} className="flex flex-col items-center gap-2">
          <div className={`size-16 border-2 border-primary/60 bg-muted ${r.className}`} />
          <div className="text-xs text-muted-foreground">{r.label}</div>
        </div>
      ))}
    </div>
  </div>
)
