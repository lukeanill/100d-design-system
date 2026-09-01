const GRADIENT_TOKENS = [
  { name: "gradient-downlight", label: "Gradient Downlight" },
  { name: "gradient-rise", label: "Gradient Rise" },
  { name: "gradient-set", label: "Gradient Set" },
] as const

const COLOR_TOKENS = [
  { group: "Surface", tokens: ["background", "foreground", "card", "card-foreground", "popover", "popover-foreground"] },
  { group: "Brand", tokens: ["primary", "primary-foreground", "secondary", "secondary-foreground", "ring"] },
  { group: "Neutral", tokens: ["muted", "muted-foreground", "accent", "accent-foreground", "input"] },
  { group: "Feedback", tokens: ["destructive", "border"] },
  { group: "Chart", tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] },
  { group: "Sidebar", tokens: ["sidebar", "sidebar-foreground", "sidebar-primary", "sidebar-primary-foreground", "sidebar-accent", "sidebar-accent-foreground", "sidebar-border", "sidebar-ring"] },
] as const

function ColorSwatch({ token }: { token: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="size-10 shrink-0 rounded-lg border border-border/60 shadow-sm"
        style={{ background: `var(--${token})` }}
      />
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{token}</div>
        <div className="truncate text-xs text-muted-foreground">--{token}</div>
      </div>
    </div>
  )
}

export default { title: "Tokens/Colors" }

export const Colors = () => (
  <div className="mx-auto flex max-w-4xl flex-col gap-12 p-8">
    <section className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Color tokens</h2>
      {COLOR_TOKENS.map((group) => (
        <div key={group.group} className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-muted-foreground">{group.group}</h3>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {group.tokens.map((token) => (
              <ColorSwatch key={token} token={token} />
            ))}
          </div>
        </div>
      ))}
    </section>

    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Gradients</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {GRADIENT_TOKENS.map((g) => (
          <div key={g.name} className="flex flex-col gap-2">
            <div
              className="h-24 rounded-2xl border border-border/60"
              style={{ backgroundImage: `var(--${g.name})` }}
            />
            <div className="text-sm font-medium">{g.label}</div>
            <div className="text-xs text-muted-foreground">--{g.name}</div>
          </div>
        ))}
      </div>
    </section>
  </div>
)
