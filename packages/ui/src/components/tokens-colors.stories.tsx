import * as React from "react"

const GRADIENT_TOKENS = [
  { name: "gradient-downlight", label: "Downlight" },
  { name: "gradient-rise", label: "Rise" },
  { name: "gradient-set", label: "Set" },
] as const

const COLOR_TOKENS = [
  {
    group: "Surface",
    tokens: ["background", "foreground", "card", "card-foreground", "popover", "popover-foreground"],
  },
  {
    group: "Brand",
    tokens: ["primary", "primary-foreground", "secondary", "secondary-foreground", "ring"],
  },
  {
    group: "Neutral",
    tokens: ["muted", "muted-foreground", "accent", "accent-foreground", "input", "border"],
  },
  {
    group: "Feedback",
    tokens: ["destructive", "affirmative", "affirmative-foreground"],
  },
  {
    group: "Chart",
    tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  },
  {
    group: "Sidebar",
    tokens: [
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ],
  },
] as const

function useResolvedColor(token: string) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [value, setValue] = React.useState("")

  React.useEffect(() => {
    if (ref.current) {
      setValue(getComputedStyle(ref.current).backgroundColor)
    }
  }, [token])

  return { ref, value }
}

function ColorSwatch({ token }: { token: string }) {
  const { ref, value } = useResolvedColor(token)

  return (
    <div className="group flex flex-col gap-3 overflow-hidden rounded-xl border border-muted bg-card shadow-xs transition-shadow hover:shadow-md">
      <div
        ref={ref}
        className="h-20 w-full"
        style={{ background: `var(--${token})` }}
      />
      <div className="flex flex-col gap-0.5 px-4 pb-4">
        <div className="text-sm font-medium text-foreground">{token}</div>
        <div className="truncate font-mono text-xs text-secondary-foreground">{value || "…"}</div>
      </div>
    </div>
  )
}

export default { title: "Tokens/Colors", parameters: { layout: "fullscreen" } }

export const Colors = () => (
  <div className="min-h-screen w-full bg-card">
   <div className="mx-auto flex max-w-5xl flex-col gap-16 p-10">
    <header className="flex flex-col gap-3 border-b border-muted pb-8">
      <p className="font-sans text-xs font-medium tracking-wide text-secondary-foreground uppercase">
        Tokens &middot; Colors
      </p>
      <h1 className="font-heading text-4xl font-normal text-foreground">Color</h1>
    </header>

    {COLOR_TOKENS.map((group) => (
      <section key={group.group} className="flex flex-col gap-5">
        <h2 className="font-heading text-xl font-normal text-foreground">{group.group}</h2>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {group.tokens.map((token) => (
            <ColorSwatch key={token} token={token} />
          ))}
        </div>
      </section>
    ))}

    <section className="flex flex-col gap-5">
      <h2 className="font-heading text-xl font-normal text-foreground">Gradients</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {GRADIENT_TOKENS.map((g) => (
          <div key={g.name} className="flex flex-col gap-3 overflow-hidden rounded-xl border border-muted bg-card shadow-xs">
            <div className="h-24 w-full" style={{ backgroundImage: `var(--${g.name})` }} />
            <div className="flex flex-col gap-0.5 px-4 pb-4">
              <div className="text-sm font-medium text-foreground">{g.label}</div>
              <div className="font-mono text-xs text-secondary-foreground">--{g.name}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
   </div>
  </div>
)
